import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { Prisma, ApplicationStatus } from '@prisma/client';
import {
  CreateApplicationDto,
  ApplicationFilterDto,
} from './dto/applications.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async generateApplicationNumber(): Promise<string> {
    const lastApp = await this.prisma.application.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { applicationNumber: true },
    });
    const lastNum = lastApp
      ? parseInt(lastApp.applicationNumber.replace('APP-', ''), 10)
      : 0;
    return `APP-${String(lastNum + 1).padStart(4, '0')}`;
  }

  async create(data: CreateApplicationDto, ip?: string) {
    const applicationNumber = await this.generateApplicationNumber();
    const app = await this.prisma.application.create({
      data: {
        ...data,
        applicationNumber,
        submissionIp: ip,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        applicationId: app.id,
        action: 'Application Received',
        performedBy: 'System',
      },
    });

    if (data.resumeFileKey) {
      await this.prisma.document.create({
        data: {
          applicationId: app.id,
          fileName: data.resumeFileName || 'Resume.pdf',
          fileKey: data.resumeFileKey,
          fileSize: data.resumeFileSize || 0,
          mimeType: data.resumeMimeType || 'application/pdf',
        },
      });
    }

    this.logger.log(`Application created: ${applicationNumber}`);
    return app;
  }

  private parseExperienceYears(value?: string | null): number | null {
    if (!value?.trim()) return null;
    const match = value.match(/(\d+(?:\.\d+)?)/);
    if (!match) return null;
    const years = Number(match[1]);
    return Number.isFinite(years) ? years : null;
  }

  private experienceInRange(
    years: number | null,
    range: string,
  ): boolean {
    if (years === null) return false;
    switch (range) {
      case '0-2':
        return years >= 0 && years <= 2;
      case '3-5':
        return years >= 3 && years <= 5;
      case '6-10':
        return years >= 6 && years <= 10;
      case '10+':
        return years >= 10;
      default:
        return false;
    }
  }

  private datePresetToRange(preset: string): { gte: Date } | null {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    switch (preset) {
      case 'today':
        return { gte: startOfToday };
      case '7d': {
        const d = new Date(startOfToday);
        d.setDate(d.getDate() - 7);
        return { gte: d };
      }
      case '30d': {
        const d = new Date(startOfToday);
        d.setDate(d.getDate() - 30);
        return { gte: d };
      }
      case '90d': {
        const d = new Date(startOfToday);
        d.setDate(d.getDate() - 90);
        return { gte: d };
      }
      default:
        return null;
    }
  }

  async findAll(filters: ApplicationFilterDto) {
    const page = filters.page || DEFAULT_PAGE;
    const pageSize = filters.pageSize || DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ApplicationWhereInput = { deletedAt: null };
    const and: Prisma.ApplicationWhereInput[] = [];

    if (filters.status) where.status = filters.status;
    if (filters.practice) {
      where.practice = { equals: filters.practice, mode: 'insensitive' };
    }
    if (filters.location) {
      where.preferredLocation = {
        equals: filters.location,
        mode: 'insensitive',
      };
    }
    if (filters.search?.trim()) {
      const q = filters.search.trim();
      and.push({
        OR: [
          { fullName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      });
    }
    if (filters.date) {
      const range = this.datePresetToRange(filters.date);
      if (range) where.createdAt = range;
    }

    // Experience is stored as free-form text; resolve matching IDs first.
    if (filters.experience) {
      const candidates = await this.prisma.application.findMany({
        where: { deletedAt: null, experienceYears: { not: null } },
        select: { id: true, experienceYears: true },
      });
      const matchingIds = candidates
        .filter((c) =>
          this.experienceInRange(
            this.parseExperienceYears(c.experienceYears),
            filters.experience!,
          ),
        )
        .map((c) => c.id);

      if (matchingIds.length === 0) {
        return {
          data: [],
          meta: { total: 0, page, pageSize, totalPages: 0 },
        };
      }
      and.push({ id: { in: matchingIds } });
    }

    if (and.length > 0) where.AND = and;

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { job: { select: { jobTitle: true } } },
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findOne(id: string) {
    const app = await this.prisma.application.findUnique({
      where: { id, deletedAt: null },
      include: {
        job: true,
        documents: true,
        notes: {
          include: { admin: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async updateStatus(id: string, status: string, adminId: string) {
    await this.findOne(id);
    const updated = await this.prisma.application.update({
      where: { id },
      data: { status: status as ApplicationStatus },
    });

    await this.prisma.activityLog.create({
      data: {
        applicationId: id,
        action: `Status Changed to ${status}`,
        performedBy: adminId,
      },
    });

    return updated;
  }

  async addNote(applicationId: string, adminId: string, content: string) {
    await this.findOne(applicationId);
    return this.prisma.internalNote.create({
      data: {
        applicationId,
        adminId,
        content,
      },
    });
  }

  async getNotes(applicationId: string) {
    await this.findOne(applicationId);
    return this.prisma.internalNote.findMany({
      where: { applicationId },
      include: { admin: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActivity(applicationId: string) {
    await this.findOne(applicationId);
    return this.prisma.activityLog.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocuments(applicationId: string) {
    await this.findOne(applicationId);
    return this.prisma.document.findMany({
      where: { applicationId },
      orderBy: { uploadedAt: 'desc' },
    });
  }
}
