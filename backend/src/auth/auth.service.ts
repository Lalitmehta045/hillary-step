import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SessionService } from './session.service';
import { AuditService } from '../audit/audit.service';
import { MfaService } from './mfa.service';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
  private readonly MAX_MFA_ATTEMPTS = 5;
  private readonly MFA_LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
  private mfaAttempts = new Map<
    string,
    { count: number; lockedUntil: Date | null }
  >();

  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
    private readonly auditService: AuditService,
    private readonly mfaService: MfaService,
  ) {}

  /**
   * Validates credentials and creates a session for the admin.
   */
  async login(loginDto: LoginDto, ip: string, userAgent: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: loginDto.email },
    });

    if (!admin) {
      await this.auditService.log(
        'FAILED_LOGIN',
        undefined,
        undefined,
        undefined,
        ip,
        userAgent,
        { email: loginDto.email, reason: 'Admin not found' },
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!admin.isActive) {
      await this.auditService.log(
        'FAILED_LOGIN',
        'Admin',
        admin.id,
        admin.id,
        ip,
        userAgent,
        { reason: 'Account inactive' },
      );
      throw new UnauthorizedException('Account is inactive');
    }

    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      throw new UnauthorizedException(
        'Account is temporarily locked due to too many failed attempts.',
      );
    }

    let isPasswordValid = false;
    try {
      isPasswordValid = await argon2.verify(
        admin.passwordHash,
        loginDto.password,
      );
    } catch (e) {
      this.logger.warn(`Argon2 verify failed for admin ${admin.id}: ${e.message}`);
      isPasswordValid = false;
    }

    if (!isPasswordValid) {
      const failedAttempts = admin.failedAttempts + 1;
      let lockedUntil = admin.lockedUntil;

      if (failedAttempts >= this.MAX_LOGIN_ATTEMPTS) {
        lockedUntil = new Date(Date.now() + this.LOCKOUT_DURATION_MS);
      }

      await this.prisma.admin.update({
        where: { id: admin.id },
        data: { failedAttempts, lockedUntil },
      });

      await this.auditService.log(
        'FAILED_LOGIN',
        'Admin',
        admin.id,
        admin.id,
        ip,
        userAgent,
        { reason: 'Invalid password', failedAttempts },
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    // Success - reset attempts
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
      },
    });

    if (admin.mfaEnabled) {
      await this.auditService.log(
        'MFA_CHALLENGE_ISSUED',
        'Admin',
        admin.id,
        admin.id,
        ip,
        userAgent,
      );
      return {
        requiresMfa: true,
        mfaToken: this.generateMfaChallenge(admin.id),
      };
    }

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    });

    const session = await this.sessionService.createSession(
      admin.id,
      ip,
      userAgent,
    );
    await this.auditService.log(
      'ADMIN_LOGIN',
      'Admin',
      admin.id,
      admin.id,
      ip,
      userAgent,
    );

    return { admin, token: session.token };
  }

  private generateMfaChallenge(adminId: string): string {
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    const payload = `${adminId}:${expires}`;
    const hmac = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'fallback')
      .update(payload)
      .digest('hex');
    return Buffer.from(`${payload}:${hmac}`).toString('base64');
  }

  private verifyMfaChallenge(token: string): string | null {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf8');
      const [adminId, expiresStr, hmac] = decoded.split(':');
      if (Date.now() > parseInt(expiresStr, 10)) return null;

      const payload = `${adminId}:${expiresStr}`;
      const expectedHmac = crypto
        .createHmac('sha256', process.env.JWT_SECRET || 'fallback')
        .update(payload)
        .digest('hex');

      if (hmac !== expectedHmac) return null;
      return adminId;
    } catch {
      return null;
    }
  }

  async verifyMfa(
    mfaToken: string,
    code: string,
    ip: string,
    userAgent: string,
  ) {
    const adminId = this.verifyMfaChallenge(mfaToken);
    if (!adminId) {
      throw new UnauthorizedException('Invalid or expired MFA token');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin || !admin.mfaEnabled || !admin.mfaSecret) {
      throw new UnauthorizedException('MFA not configured properly');
    }

    // Brute-force protection for MFA attempts
    const attempts = this.mfaAttempts.get(adminId);
    if (attempts?.lockedUntil && attempts.lockedUntil > new Date()) {
      await this.auditService.log(
        'MFA_LOCKED',
        'Admin',
        adminId,
        adminId,
        ip,
        userAgent,
      );
      throw new UnauthorizedException(
        'Too many failed MFA attempts. Please try again later.',
      );
    }

    const secret = this.mfaService.decryptSecret(admin.mfaSecret);
    const isValid = this.mfaService.verifyCode(code, secret);

    if (!isValid) {
      const current = this.mfaAttempts.get(adminId) || {
        count: 0,
        lockedUntil: null,
      };
      current.count += 1;
      if (current.count >= this.MAX_MFA_ATTEMPTS) {
        current.lockedUntil = new Date(
          Date.now() + this.MFA_LOCKOUT_DURATION_MS,
        );
      }
      this.mfaAttempts.set(adminId, current);

      await this.auditService.log(
        'FAILED_MFA',
        'Admin',
        admin.id,
        admin.id,
        ip,
        userAgent,
      );
      throw new UnauthorizedException('Invalid MFA code');
    }

    // Success - clear MFA attempt tracking
    this.mfaAttempts.delete(adminId);

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date(), lastLoginIp: ip },
    });

    const session = await this.sessionService.createSession(
      admin.id,
      ip,
      userAgent,
    );
    await this.auditService.log(
      'ADMIN_LOGIN_MFA',
      'Admin',
      admin.id,
      admin.id,
      ip,
      userAgent,
    );

    return { admin, token: session.token };
  }

  async verifyRecoveryCode(
    mfaToken: string,
    code: string,
    ip: string,
    userAgent: string,
  ) {
    const adminId = this.verifyMfaChallenge(mfaToken);
    if (!adminId)
      throw new UnauthorizedException('Invalid or expired MFA token');

    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin || !admin.mfaEnabled)
      throw new UnauthorizedException('MFA not configured');

    const storedCodes = (admin.recoveryCodes as string[]) || [];
    const { valid, updatedCodes } =
      await this.mfaService.verifyAndConsumeRecoveryCode(code, storedCodes);

    if (!valid) {
      await this.auditService.log(
        'FAILED_RECOVERY_CODE',
        'Admin',
        admin.id,
        admin.id,
        ip,
        userAgent,
      );
      throw new UnauthorizedException('Invalid recovery code');
    }

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        recoveryCodes: updatedCodes,
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    });

    const session = await this.sessionService.createSession(
      admin.id,
      ip,
      userAgent,
    );
    await this.auditService.log(
      'ADMIN_LOGIN_RECOVERY',
      'Admin',
      admin.id,
      admin.id,
      ip,
      userAgent,
    );

    return { admin, token: session.token };
  }

  async generateMfaEnrollment(adminId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin) throw new UnauthorizedException('Admin not found');
    if (admin.mfaEnabled)
      throw new BadRequestException('MFA is already enabled');

    const secret = this.mfaService.generateSecret();
    const encryptedSecret = this.mfaService.encryptSecret(secret);

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { mfaSecret: encryptedSecret },
    });

    const qrCode = await this.mfaService.generateQrCodeDataUrl(
      admin.email,
      secret,
    );
    return { qrCode, secret }; // Temporarily return plaintext secret for manual entry if needed, but only during enrollment
  }

  async enableMfa(
    adminId: string,
    code: string,
    ip: string,
    userAgent: string,
  ) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin || !admin.mfaSecret)
      throw new BadRequestException('Must generate MFA first');
    if (admin.mfaEnabled)
      throw new BadRequestException('MFA is already enabled');

    const secret = this.mfaService.decryptSecret(admin.mfaSecret);
    const isValid = this.mfaService.verifyCode(code, secret);

    if (!isValid) throw new BadRequestException('Invalid MFA code');

    const { plainCodes, hashedCodes } =
      await this.mfaService.generateRecoveryCodes();

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { mfaEnabled: true, recoveryCodes: hashedCodes },
    });

    await this.auditService.log(
      'MFA_ENABLED',
      'Admin',
      admin.id,
      admin.id,
      ip,
      userAgent,
    );

    return { recoveryCodes: plainCodes };
  }

  async disableMfa(
    adminId: string,
    password: string,
    ip: string,
    userAgent: string,
  ) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin) throw new UnauthorizedException('Admin not found');

    const isPasswordValid = await argon2.verify(admin.passwordHash, password);
    if (!isPasswordValid) {
      await this.auditService.log(
        'FAILED_MFA_DISABLE',
        'Admin',
        adminId,
        adminId,
        ip,
        userAgent,
      );
      throw new UnauthorizedException('Invalid password');
    }

    await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        recoveryCodes: Prisma.DbNull,
      },
    });

    await this.sessionService.revokeAllSessions(adminId);
    await this.auditService.log(
      'MFA_DISABLED',
      'Admin',
      adminId,
      adminId,
      ip,
      userAgent,
    );

    return { message: 'MFA disabled successfully' };
  }

  /**
   * Validates if a session token is still valid.
   */
  async validateSession(token: string) {
    return this.sessionService.validateSession(token);
  }

  /**
   * Logs out an admin by revoking their session.
   */
  async logout(token: string, ip: string, userAgent: string) {
    const session = await this.sessionService.validateSession(token);
    if (session) {
      await this.sessionService.revokeSession(token);
      await this.auditService.log(
        'ADMIN_LOGOUT',
        'Admin',
        session.admin.id,
        session.admin.id,
        ip,
        userAgent,
      );
    }
  }
}
