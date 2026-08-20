import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../common/constants';

describe('ContactService', () => {
  let service: ContactService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      enquiry: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a valid contact with generated enquiry number ENQ-0001 when no previous exist', async () => {
      (prisma.enquiry.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.enquiry.create as jest.Mock).mockResolvedValue({
        id: '1',
        enquiryNumber: 'ENQ-0001',
      } as any);

      const dto = { name: 'John Doe', email: 'john@example.com' };
      const ip = '127.0.0.1';

      const result = await service.create(dto, ip);

      expect(prisma.enquiry.findFirst).toHaveBeenCalled();
      expect(prisma.enquiry.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          enquiryNumber: 'ENQ-0001',
          submissionIp: ip,
        },
      });
      expect(result).toEqual({ id: '1', enquiryNumber: 'ENQ-0001' });
    });

    it('should create a valid contact with incremented enquiry number when previous exist', async () => {
      (prisma.enquiry.findFirst as jest.Mock).mockResolvedValue({
        enquiryNumber: 'ENQ-0005',
      } as any);
      (prisma.enquiry.create as jest.Mock).mockResolvedValue({
        id: '2',
        enquiryNumber: 'ENQ-0006',
      } as any);

      const dto = { name: 'Jane Doe', email: 'jane@example.com' };
      const ip = '192.168.1.1';

      const result = await service.create(dto, ip);

      expect(prisma.enquiry.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          enquiryNumber: 'ENQ-0006',
          submissionIp: ip,
        },
      });
      expect(result).toEqual({ id: '2', enquiryNumber: 'ENQ-0006' });
    });

    it('should handle duplicate submissions by throwing an error from Prisma (mocked)', async () => {
      (prisma.enquiry.findFirst as jest.Mock).mockResolvedValue(null);
      const duplicateError = new Error('Unique constraint failed');
      (prisma.enquiry.create as jest.Mock).mockRejectedValue(duplicateError);

      const dto = { email: 'duplicate@example.com' };
      await expect(service.create(dto as any)).rejects.toThrow(
        'Unique constraint failed',
      );
    });

    it('should handle missing fields if Prisma throws validation error (mocked)', async () => {
      (prisma.enquiry.findFirst as jest.Mock).mockResolvedValue(null);
      const validationError = new Error(
        'Prisma validation error: missing fields',
      );
      (prisma.enquiry.create as jest.Mock).mockRejectedValue(validationError);

      const dto = { email: 'missing' } as any; // Missing required fields
      await expect(service.create(dto)).rejects.toThrow(
        'Prisma validation error',
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated enquiries with default values', async () => {
      const mockData = [{ id: '1' }];
      (prisma.enquiry.findMany as jest.Mock).mockResolvedValue(mockData as any);
      (prisma.enquiry.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAll({});

      expect(prisma.enquiry.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: DEFAULT_PAGE_SIZE,
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.enquiry.count).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual({
        data: mockData,
        meta: {
          total: 1,
          page: DEFAULT_PAGE,
          pageSize: DEFAULT_PAGE_SIZE,
          totalPages: 1,
        },
      });
    });

    it('should apply search and status filters correctly', async () => {
      (prisma.enquiry.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.enquiry.count as jest.Mock).mockResolvedValue(0);

      await service.findAll({
        search: 'test',
        status: 'PENDING',
        page: 2,
        pageSize: 5,
      });

      const expectedWhere = {
        status: 'PENDING',
        OR: [
          { companyName: { contains: 'test', mode: 'insensitive' } },
          { contactPerson: { contains: 'test', mode: 'insensitive' } },
          { email: { contains: 'test', mode: 'insensitive' } },
          { name: { contains: 'test', mode: 'insensitive' } },
        ],
      };

      expect(prisma.enquiry.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        skip: 5, // (2 - 1) * 5
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.enquiry.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single enquiry if found', async () => {
      const mockEnquiry = { id: '1' };
      (prisma.enquiry.findUnique as jest.Mock).mockResolvedValue(
        mockEnquiry as any,
      );

      const result = await service.findOne('1');
      expect(prisma.enquiry.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockEnquiry);
    });

    it('should throw NotFoundException if enquiry not found', async () => {
      (prisma.enquiry.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(
        new NotFoundException('Enquiry with ID 999 not found'),
      );
    });
  });

  describe('updateStatus', () => {
    it('should update and return the enquiry status', async () => {
      (prisma.enquiry.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
      } as any);
      (prisma.enquiry.update as jest.Mock).mockResolvedValue({
        id: '1',
        status: 'RESOLVED',
      } as any);

      const result = await service.updateStatus('1', 'RESOLVED');

      expect(prisma.enquiry.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'RESOLVED' },
      });
      expect(result).toEqual({ id: '1', status: 'RESOLVED' });
    });
  });

  describe('updatePriority', () => {
    it('should update and return the enquiry priority', async () => {
      (prisma.enquiry.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
      } as any);
      (prisma.enquiry.update as jest.Mock).mockResolvedValue({
        id: '1',
        priority: 'HIGH',
      } as any);

      const result = await service.updatePriority('1', 'HIGH');

      expect(prisma.enquiry.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { priority: 'HIGH' },
      });
      expect(result).toEqual({ id: '1', priority: 'HIGH' });
    });
  });
});
