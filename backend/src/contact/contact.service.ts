import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../common/constants';
import type { Prisma, EnquiryStatus, EnquiryPriority } from '@prisma/client';
import { CreateEnquiryDto, EnquiryFilterDto } from './dto/contact.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /** Generate sequential enquiry number */
  private async generateEnquiryNumber(): Promise<string> {
    const lastEnquiry = await this.prisma.enquiry.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { enquiryNumber: true },
    });
    const lastNum = lastEnquiry
      ? parseInt(lastEnquiry.enquiryNumber.replace('ENQ-', ''), 10)
      : 0;
    return `ENQ-${String(lastNum + 1).padStart(4, '0')}`;
  }

  /** Create a new enquiry (DB first; email failure never fails the request) */
  async create(data: CreateEnquiryDto, ip?: string) {
    const enquiryNumber = await this.generateEnquiryNumber();
    const organization =
      data.organizationName?.trim() || data.organization?.trim() || data.companyName?.trim() || null;
    const companyName =
      data.companyName?.trim() || data.organizationName?.trim() || data.organization?.trim() || null;
    const name = data.name?.trim() || [data.firstName, data.lastName].filter(Boolean).join(' ');

    const { organizationName: _orgName, ...restData } = data;

    const enquiry = await this.prisma.enquiry.create({
      data: {
        ...restData,
        organization,
        companyName,
        name,
        enquiryNumber,
        submissionIp: ip,
      },
    });
    this.logger.log(`Enquiry created: ${enquiryNumber}`);

    try {
      await this.emailService.sendEnquiryNotification(enquiry);
      this.logger.log(
        `Admin notification email succeeded for ${enquiryNumber}`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Admin notification email failed for ${enquiryNumber}: ${message}`,
      );
    }

    return enquiry;
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

  private regionWhere(region: string): Prisma.EnquiryWhereInput | null {
    switch (region.toUpperCase()) {
      case 'USA':
        return {
          OR: [
            { countryCode: { contains: 'USA', mode: 'insensitive' } },
            { phone: { contains: '(USA)', mode: 'insensitive' } },
            { phone: { startsWith: '+1 (' } },
            { phone: { startsWith: '+1 ' } },
          ],
        };
      case 'IND':
        return {
          OR: [
            { countryCode: { contains: 'IND', mode: 'insensitive' } },
            { phone: { contains: '(IND)', mode: 'insensitive' } },
            { phone: { contains: '+91', mode: 'insensitive' } },
          ],
        };
      case 'AUS':
        return {
          OR: [
            { countryCode: { contains: 'AUS', mode: 'insensitive' } },
            { phone: { contains: '(AUS)', mode: 'insensitive' } },
            { phone: { contains: '+61', mode: 'insensitive' } },
          ],
        };
      default:
        return null;
    }
  }

  /** Find all enquiries with pagination and filters */
  async findAll(filters: EnquiryFilterDto) {
    const page = filters.page || DEFAULT_PAGE;
    const pageSize = filters.pageSize || DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * pageSize;

    const where: Prisma.EnquiryWhereInput = {};
    const and: Prisma.EnquiryWhereInput[] = [];

    if (filters.status) {
      where.status = filters.status as EnquiryStatus;
    }
    if (filters.search?.trim()) {
      const q = filters.search.trim();
      and.push({
        OR: [
          { companyName: { contains: q, mode: 'insensitive' } },
          { contactPerson: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { name: { contains: q, mode: 'insensitive' } },
          { organization: { contains: q, mode: 'insensitive' } },
        ],
      });
    }
    if (filters.region) {
      const regionFilter = this.regionWhere(filters.region);
      if (regionFilter) and.push(regionFilter);
    }
    if (filters.date) {
      const range = this.datePresetToRange(filters.date);
      if (range) where.createdAt = range;
    }
    if (and.length > 0) where.AND = and;

    const [data, total] = await Promise.all([
      this.prisma.enquiry.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.enquiry.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /** Find a single enquiry by ID */
  async findOne(id: string) {
    const enquiry = await this.prisma.enquiry.findUnique({ where: { id } });
    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }
    return enquiry;
  }

  /** Update enquiry status */
  async updateStatus(id: string, status: string) {
    await this.findOne(id);
    return this.prisma.enquiry.update({
      where: { id },
      data: { status: status as EnquiryStatus },
    });
  }

  /** Update enquiry priority */
  async updatePriority(id: string, priority: string) {
    await this.findOne(id);
    return this.prisma.enquiry.update({
      where: { id },
      data: { priority: priority as EnquiryPriority },
    });
  }
}
