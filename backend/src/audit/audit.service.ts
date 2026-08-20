import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs an action for security or compliance purposes.
   */
  async log(
    action: string,
    entityType?: string,
    entityId?: string,
    adminId?: string,
    ipAddress?: string,
    userAgent?: string,
    metadata?: import('@prisma/client').Prisma.InputJsonValue,
  ) {
    return this.prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        adminId,
        ipAddress,
        userAgent,
        metadata: metadata ? metadata : undefined,
      },
    });
  }

  /**
   * Retrieves audit logs for a specific entity.
   */
  async findByEntity(entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  /**
   * Retrieves audit logs performed by a specific admin.
   */
  async findByAdmin(adminId: string) {
    return this.prisma.auditLog.findMany({
      where: { adminId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
