import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import {
  LoginDto,
  MfaVerifyDto,
  MfaEnrollDto,
  MfaRecoveryDto,
  MfaDisableDto,
} from './dto/login.dto';
import { ClientIp } from '../common/decorators/client-ip.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentAdmin } from '../common/decorators/current-admin.decorator';
import type { Admin } from '@prisma/client';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mfaService: MfaService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @ClientIp() ip: string,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const uaHeader = req.headers['user-agent'];
    const userAgent = Array.isArray(uaHeader) ? uaHeader[0] : (uaHeader || 'Unknown');
    const result = await this.authService.login(loginDto, ip, userAgent);

    // MFA challenge — do not set session cookie, return challenge token
    if ('requiresMfa' in result) {
      return { requiresMfa: true, mfaToken: result.mfaToken };
    }

    res.setCookie('hs_session', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    const { passwordHash: _, mfaSecret: __, ...adminData } = result.admin;
    void _;
    void __;
    return { message: 'Login successful', admin: adminData };
  }

  @Post('mfa/verify')
  async verifyMfa(
    @Body() mfaVerifyDto: MfaVerifyDto,
    @ClientIp() ip: string,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const uaHeader = req.headers['user-agent'];
    const userAgent = Array.isArray(uaHeader) ? uaHeader[0] : (uaHeader || 'Unknown');
    const result = await this.authService.verifyMfa(
      mfaVerifyDto.mfaToken,
      mfaVerifyDto.code,
      ip,
      userAgent,
    );

    res.setCookie('hs_session', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
    });

    const { passwordHash: _, mfaSecret: __, ...adminData } = result.admin;
    void _;
    void __;
    return { message: 'Login successful', admin: adminData };
  }

  @Post('mfa/recovery')
  async verifyRecoveryCode(
    @Body() dto: MfaRecoveryDto,
    @ClientIp() ip: string,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const uaHeader = req.headers['user-agent'];
    const userAgent = Array.isArray(uaHeader) ? uaHeader[0] : (uaHeader || 'Unknown');
    const result = await this.authService.verifyRecoveryCode(
      dto.mfaToken,
      dto.code,
      ip,
      userAgent,
    );

    res.setCookie('hs_session', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
    });

    const { passwordHash: _, mfaSecret: __, ...adminData } = result.admin;
    void _;
    void __;
    return { message: 'Login successful', admin: adminData };
  }

  @UseGuards(AuthGuard)
  @Post('mfa/enroll')
  async enrollMfa(@CurrentAdmin() admin: Admin) {
    return this.authService.generateMfaEnrollment(admin.id);
  }

  @UseGuards(AuthGuard)
  @Post('mfa/enable')
  async enableMfa(
    @Body() dto: MfaEnrollDto,
    @CurrentAdmin() admin: Admin,
    @ClientIp() ip: string,
    @Req() req: FastifyRequest,
  ) {
    const uaHeader = req.headers['user-agent'];
    const userAgent = Array.isArray(uaHeader) ? uaHeader[0] : (uaHeader || 'Unknown');
    return this.authService.enableMfa(admin.id, dto.code, ip, userAgent);
  }

  @UseGuards(AuthGuard)
  @Post('mfa/disable')
  async disableMfa(
    @Body() dto: MfaDisableDto,
    @CurrentAdmin() admin: Admin,
    @ClientIp() ip: string,
    @Req() req: FastifyRequest,
  ) {
    const uaHeader = req.headers['user-agent'];
    const userAgent = Array.isArray(uaHeader) ? uaHeader[0] : (uaHeader || 'Unknown');
    return this.authService.disableMfa(admin.id, dto.password, ip, userAgent);
  }

  @UseGuards(AuthGuard)
  @Get('mfa/status')
  getMfaStatus(@CurrentAdmin() admin: Admin) {
    return { mfaEnabled: admin.mfaEnabled };
  }

  @Post('logout')
  async logout(
    @Req() req: FastifyRequest,
    @ClientIp() ip: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const token = req.cookies['hs_session'];
    const uaHeader = req.headers['user-agent'];
    const userAgent = Array.isArray(uaHeader) ? uaHeader[0] : (uaHeader || 'Unknown');

    if (token) {
      await this.authService.logout(token, ip, userAgent);
      res.clearCookie('hs_session', { path: '/' });
    }

    return { message: 'Logout successful' };
  }

  @UseGuards(AuthGuard)
  @Get('session')
  getSession(@CurrentAdmin() admin: Admin) {
    const { passwordHash: _, mfaSecret: __, ...adminData } = admin;
    void _;
    void __;
    return { admin: adminData };
  }
}
