import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../email/email.service';
import { NotFoundException } from '@nestjs/common';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../common/constants';

describe('ContactService', () => {
  let service: ContactService;
  let prisma: jest.Mocked<PrismaService>;
  let emailService: { sendEnquiryNotification: jest.Mock };

  const validDto = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (USA) 5551234567',
    companyName: 'Acme Inc',
    message: 'Looking for executive search support.',
  };

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

    emailService = {
      sendEnquiryNotification: jest.fn().mockResolvedValue({ id: 'email_1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EmailService,
          useValue: emailService,
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
    it('TEST 1: valid enquiry is saved and email service is called', async () => {
      (prisma.enquiry.findFirst as jest.Mock).mockResolvedValue(null);
      const saved = {
        id: '1',
        enquiryNumber: 'ENQ-0001',
        ...validDto,
        organization: 'Acme Inc',
        companyName: 'Acme Inc',
        createdAt: new Date(),
      };
      (prisma.enquiry.create as jest.Mock).mockResolvedValue(saved as any);

      const result = await service.create(validDto, '127.0.0.1');

      expect(prisma.enquiry.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 (USA) 5551234567',
          organization: 'Acme Inc',
          companyName: 'Acme Inc',
          enquiryNumber: 'ENQ-0001',
          submissionIp: '127.0.0.1',
        }),
      });
      expect(emailService.sendEnquiryNotification).toHaveBeenCalledWith(saved);
      expect(result).toEqual(saved);
    });

    it('TEST 2: email provider failure still saves enquiry and returns success', async () => {
      (prisma.enquiry.findFirst as jest.Mock).mockResolvedValue(null);
      const saved = {
        id: '2',
        enquiryNumber: 'ENQ-0002',
        ...validDto,
        organization: 'Acme Inc',
        createdAt: new Date(),
      };
      (prisma.enquiry.create as jest.Mock).mockResolvedValue(saved as any);
      emailService.sendEnquiryNotification.mockRejectedValue(
        new Error('Resend unavailable'),
      );

      const result = await service.create(validDto, '127.0.0.1');

      expect(prisma.enquiry.create).toHaveBeenCalled();
      expect(emailService.sendEnquiryNotification).toHaveBeenCalled();
      expect(result).toEqual(saved);
    });

    it('TEST 4: notification payload includes name, email, phone, organization, message', async () => {
      (prisma.enquiry.findFirst as jest.Mock).mockResolvedValue(null);
      const saved = {
        id: '4',
        enquiryNumber: 'ENQ-0004',
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+91 (IND) 9876543210',
        organization: 'Hillary Client',
        companyName: 'Hillary Client',
        message: 'Need contractors in Mumbai.',
        createdAt: new Date('2026-08-21T12:00:00.000Z'),
      };
      (prisma.enquiry.create as jest.Mock).mockResolvedValue(saved as any);

      await service.create(
        {
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '+91 (IND) 9876543210',
          organization: 'Hillary Client',
          message: 'Need contractors in Mumbai.',
        },
        '10.0.0.1',
      );

      expect(emailService.sendEnquiryNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '+91 (IND) 9876543210',
          organization: 'Hillary Client',
          message: 'Need contractors in Mumbai.',
        }),
      );
    });

    it('should create a valid contact with incremented enquiry number when previous exist', async () => {
      (prisma.enquiry.findFirst as jest.Mock).mockResolvedValue({
        enquiryNumber: 'ENQ-0005',
      } as any);
      (prisma.enquiry.create as jest.Mock).mockResolvedValue({
        id: '2',
        enquiryNumber: 'ENQ-0006',
      } as any);

      const result = await service.create(validDto, '192.168.1.1');

      expect(prisma.enquiry.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          enquiryNumber: 'ENQ-0006',
          submissionIp: '192.168.1.1',
        }),
      });
      expect(result).toEqual({ id: '2', enquiryNumber: 'ENQ-0006' });
    });

    it('should handle duplicate submissions by throwing an error from Prisma (mocked)', async () => {
      (prisma.enquiry.findFirst as jest.Mock).mockResolvedValue(null);
      const duplicateError = new Error('Unique constraint failed');
      (prisma.enquiry.create as jest.Mock).mockRejectedValue(duplicateError);

      await expect(service.create(validDto)).rejects.toThrow(
        'Unique constraint failed',
      );
      expect(emailService.sendEnquiryNotification).not.toHaveBeenCalled();
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
        AND: [
          {
            OR: [
              { companyName: { contains: 'test', mode: 'insensitive' } },
              { contactPerson: { contains: 'test', mode: 'insensitive' } },
              { email: { contains: 'test', mode: 'insensitive' } },
              { name: { contains: 'test', mode: 'insensitive' } },
              { organization: { contains: 'test', mode: 'insensitive' } },
            ],
          },
        ],
      };

      expect(prisma.enquiry.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        skip: 5,
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
