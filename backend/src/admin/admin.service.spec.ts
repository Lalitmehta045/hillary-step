import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('AdminService', () => {
  let service: AdminService;
  const mockPrismaService = {
    job: { count: jest.fn() },
    application: { count: jest.fn() },
    enquiry: { count: jest.fn() },
    admin: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard stats', async () => {
      mockPrismaService.job.count.mockResolvedValue(10);
      mockPrismaService.application.count.mockResolvedValue(20);
      mockPrismaService.enquiry.count.mockResolvedValue(30);

      const result = await service.getDashboardStats();
      expect(result).toEqual({ jobs: 10, applications: 20, enquiries: 30 });
    });
  });

  describe('getProfile', () => {
    it('should return profile without passwordHash', async () => {
      const mockAdmin = {
        id: '1',
        email: 'admin@test.com',
        passwordHash: 'hash',
      };
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);

      const result = await service.getProfile('1');
      expect(result).toEqual({ id: '1', email: 'admin@test.com' });
    });

    it('should throw NotFoundException if admin not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update and return profile without passwordHash', async () => {
      const dto = { name: 'Admin2' };
      const updatedAdmin = { id: '1', name: 'Admin2', passwordHash: 'hash' };
      mockPrismaService.admin.update.mockResolvedValue(updatedAdmin);

      const result = await service.updateProfile('1', dto);
      expect(mockPrismaService.admin.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: dto,
      });
      expect(result).toEqual({ id: '1', name: 'Admin2' });
    });
  });

  describe('changePassword', () => {
    const dto = { oldPassword: 'old', newPassword: 'new' };
    const mockAdmin = { id: '1', passwordHash: 'hash' };

    it('should change password successfully', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (argon2.hash as jest.Mock).mockResolvedValue('newHash');
      mockPrismaService.admin.update.mockResolvedValue({});

      const result = await service.changePassword('1', dto);
      expect(argon2.verify).toHaveBeenCalledWith('hash', 'old');
      expect(argon2.hash).toHaveBeenCalledWith('new');
      expect(mockPrismaService.admin.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { passwordHash: 'newHash' },
      });
      expect(result).toEqual({ message: 'Password updated successfully' });
    });

    it('should throw NotFoundException if admin not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);
      await expect(service.changePassword('1', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if old password is wrong', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      (argon2.verify as jest.Mock).mockResolvedValue(false);
      await expect(service.changePassword('1', dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
