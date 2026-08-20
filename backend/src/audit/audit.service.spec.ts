import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { PrismaService } from '../database/prisma.service';

describe('AuditService', () => {
  let service: AuditService;

  const mockPrismaService = {
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('should create an audit log', async () => {
      const mockLog = { id: '1', action: 'LOGIN' };
      mockPrismaService.auditLog.create.mockResolvedValue(mockLog);

      const result = await service.log(
        'LOGIN',
        'User',
        '1',
        'admin1',
        '127.0.0.1',
        'agent',
        { test: true },
      );
      expect(mockPrismaService.auditLog.create).toHaveBeenCalledWith({
        data: {
          action: 'LOGIN',
          entityType: 'User',
          entityId: '1',
          adminId: 'admin1',
          ipAddress: '127.0.0.1',
          userAgent: 'agent',
          metadata: { test: true },
        },
      });
      expect(result).toEqual(mockLog);
    });

    it('should create an audit log with undefined metadata', async () => {
      mockPrismaService.auditLog.create.mockResolvedValue({});
      await service.log('LOGIN');
      expect(mockPrismaService.auditLog.create).toHaveBeenCalledWith({
        data: {
          action: 'LOGIN',
          entityType: undefined,
          entityId: undefined,
          adminId: undefined,
          ipAddress: undefined,
          userAgent: undefined,
          metadata: undefined,
        },
      });
    });
  });

  describe('findByEntity', () => {
    it('should return logs for an entity', async () => {
      const logs = [{ id: '1', action: 'CREATE' }];
      mockPrismaService.auditLog.findMany.mockResolvedValue(logs);

      const result = await service.findByEntity('User', '1');
      expect(mockPrismaService.auditLog.findMany).toHaveBeenCalledWith({
        where: { entityType: 'User', entityId: '1' },
        orderBy: { createdAt: 'desc' },
        include: { admin: { select: { id: true, name: true, email: true } } },
      });
      expect(result).toEqual(logs);
    });
  });

  describe('findByAdmin', () => {
    it('should return logs for an admin', async () => {
      const logs = [{ id: '1', action: 'CREATE' }];
      mockPrismaService.auditLog.findMany.mockResolvedValue(logs);

      const result = await service.findByAdmin('admin1');
      expect(mockPrismaService.auditLog.findMany).toHaveBeenCalledWith({
        where: { adminId: 'admin1' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(logs);
    });
  });
});
