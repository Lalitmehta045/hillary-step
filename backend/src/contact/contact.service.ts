import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../common/constants';
import type { Prisma, EnquiryStatus, EnquiryPriority } from '@prisma/client';
import { CreateEnquiryDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly prisma: PrismaService) {}

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

  /** Create a new enquiry */
  async create(data: CreateEnquiryDto, ip?: string) {
    const enquiryNumber = await this.generateEnquiryNumber();
    const enquiry = await this.prisma.enquiry.create({
      data: {
        ...data,
        enquiryNumber,
        submissionIp: ip,
      },
    });
    this.logger.log(`Enquiry created: ${enquiryNumber}`);
    return enquiry;
  }

  /** Find all enquiries with pagination and filters */
  async findAll(filters: {
    search?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = filters.page || DEFAULT_PAGE;
    const pageSize = filters.pageSize || DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * pageSize;

    const where: Prisma.EnquiryWhereInput = {};
    if (filters.status) {
      where.status = filters.status as EnquiryStatus;
    }
    if (filters.search) {
      where.OR = [
        { companyName: { contains: filters.search, mode: 'insensitive' } },
        { contactPerson: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { name: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

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
