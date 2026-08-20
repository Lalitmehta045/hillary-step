import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new session for an admin.
   */
  async createSession(adminId: string, ipAddress: string, userAgent: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    return this.prisma.adminSession.create({
      data: {
        adminId,
        token,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });
  }

  /**
   * Validates a session token and returns the session with admin details.
   */
  async validateSession(token: string) {
    const session = await this.prisma.adminSession.findUnique({
      where: { token },
      include: { admin: true },
    });

    if (!session) return null;

    if (session.expiresAt < new Date()) {
      await this.revokeSession(token);
      return null;
    }

    return session;
  }

  /**
   * Revokes a specific session.
   */
  async revokeSession(token: string) {
    await this.prisma.adminSession.deleteMany({
      where: { token },
    });
  }

  /**
   * Revokes all sessions for a given admin.
   */
  async revokeAllSessions(adminId: string) {
    await this.prisma.adminSession.deleteMany({
      where: { adminId },
    });
  }

  /**
   * Cleans up expired sessions from the database.
   */
  async cleanExpiredSessions() {
    await this.prisma.adminSession.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
