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

  async findAll(filters: ApplicationFilterDto) {
    const page = filters.page || DEFAULT_PAGE;
    const pageSize = filters.pageSize || DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ApplicationWhereInput = { deletedAt: null };
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

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
