import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { Prisma } from '@prisma/client';
import { JobStatus } from '@prisma/client';
import { CreateJobDto, UpdateJobDto, JobFilterDto } from './dto/jobs.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateJobDto & { status?: JobStatus }, isPublic = false) {
    let deadlineDate = null;
    if (data.applicationDeadline) {
      deadlineDate = new Date(data.applicationDeadline);
    }

    const { documents, applicationDeadline: _deadline, ...jobFields } = data;

    if (documents?.length) {
      for (const doc of documents) {
        if (!doc.key.startsWith('job-docs/')) {
          throw new BadRequestException('Invalid document key');
        }
      }
    }

    const attachments =
      documents?.map((doc) => ({
        fileKey: doc.key,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
      })) ?? undefined;

    return this.prisma.job.create({
      data: {
        ...jobFields,
        applicationDeadline: deadlineDate,
        status: data.status || 'DRAFT',
        isPublic: isPublic,
        ...(attachments?.length ? { attachments } : {}),
      },
    });
  }

  async findAll(filters: JobFilterDto) {
    const page = filters.page || DEFAULT_PAGE;
    const pageSize = filters.pageSize || DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * pageSize;

    const where: Prisma.JobWhereInput = { deletedAt: null };
    if (filters.status) where.status = filters.status;
    if (filters.industry) where.industry = filters.industry;
    if (filters.search) {
      where.OR = [
        { jobTitle: { contains: filters.search, mode: 'insensitive' } },
        { organizationName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findPublished(filters: JobFilterDto) {
    return this.findAll({ ...filters, status: 'PUBLISHED' as never });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id, deletedAt: null },
    });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async update(id: string, data: UpdateJobDto) {
    await this.findOne(id);
    return this.prisma.job.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.job.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async updateStatus(id: string, status: string) {
    await this.findOne(id);
    return this.prisma.job.update({
      where: { id },
      data: { status: status as JobStatus },
    });
  }
}
