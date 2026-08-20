import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, Logger } from '@nestjs/common';

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  const mockPrismaService = {
    application: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    activityLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    internalNote: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    document: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);

    // Silence logger during tests
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an application with generated number', async () => {
      const data = { fullName: 'John Doe', email: 'j@example.com' } as any;
      const ip = '127.0.0.1';

      mockPrismaService.application.findFirst.mockResolvedValue({
        applicationNumber: 'APP-0005',
      });
      mockPrismaService.application.create.mockResolvedValue({
        id: '1',
        ...data,
        applicationNumber: 'APP-0006',
        submissionIp: ip,
      });

      const result = await service.create(data, ip);

      expect(mockPrismaService.application.create).toHaveBeenCalledWith({
        data: {
          ...data,
          applicationNumber: 'APP-0006',
          submissionIp: ip,
        },
      });
      expect(mockPrismaService.activityLog.create).toHaveBeenCalledWith({
        data: {
          applicationId: '1',
          action: 'Application Received',
          performedBy: 'System',
        },
      });
      expect(result).toBeDefined();
    });

    it('should create an application starting at APP-0001 if no previous', async () => {
      mockPrismaService.application.findFirst.mockResolvedValue(null);
      mockPrismaService.application.create.mockResolvedValue({
        id: '1',
        applicationNumber: 'APP-0001',
      });

      await service.create({} as any);
      expect(mockPrismaService.application.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ applicationNumber: 'APP-0001' }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated applications', async () => {
      mockPrismaService.application.findMany.mockResolvedValue([{ id: '1' }]);
      mockPrismaService.application.count.mockResolvedValue(1);

      const result = await service.findAll({
        search: 'John',
        status: 'NEW' as any,
      });
      expect(result.data).toBeDefined();
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return application if found', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({ id: '1' });
      const result = await service.findOne('1');
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update status and log activity', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.application.update.mockResolvedValue({
        id: '1',
        status: 'REVIEWED',
      });

      await service.updateStatus('1', 'REVIEWED', 'admin-id');

      expect(mockPrismaService.application.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'REVIEWED' },
      });
      expect(mockPrismaService.activityLog.create).toHaveBeenCalledWith({
        data: {
          applicationId: '1',
          action: 'Status Changed to REVIEWED',
          performedBy: 'admin-id',
        },
      });
    });
  });

  describe('addNote', () => {
    it('should add a note', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.internalNote.create.mockResolvedValue({ id: 'note-1' });

      await service.addNote('1', 'admin-id', 'test note');
      expect(mockPrismaService.internalNote.create).toHaveBeenCalledWith({
        data: { applicationId: '1', adminId: 'admin-id', content: 'test note' },
      });
    });
  });

  describe('getNotes', () => {
    it('should return notes', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.internalNote.findMany.mockResolvedValue([
        { id: 'note-1' },
      ]);

      const result = await service.getNotes('1');
      expect(result).toBeDefined();
    });
  });

  describe('getActivity', () => {
    it('should return activity logs', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.activityLog.findMany.mockResolvedValue([
        { id: 'log-1' },
      ]);

      const result = await service.getActivity('1');
      expect(result).toBeDefined();
    });
  });

  describe('getDocuments', () => {
    it('should return documents', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.document.findMany.mockResolvedValue([{ id: 'doc-1' }]);

      const result = await service.getDocuments('1');
      expect(result).toBeDefined();
    });
  });
});
