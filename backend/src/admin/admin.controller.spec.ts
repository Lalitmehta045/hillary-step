import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthGuard } from '../common/guards/auth.guard';

describe('AdminController', () => {
  let controller: AdminController;
  const mockAdminService = {
    getDashboardStats: jest.fn(),
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AdminController>(AdminController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard stats', async () => {
      const stats = { jobs: 1, applications: 2, enquiries: 3 };
      mockAdminService.getDashboardStats.mockResolvedValue(stats);

      const result = await controller.getDashboardStats();
      expect(result).toEqual(stats);
      expect(mockAdminService.getDashboardStats).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return profile', async () => {
      const profile = { id: '1', email: 'test@test.com' };
      mockAdminService.getProfile.mockResolvedValue(profile);

      const req = { admin: { id: '1' } } as any;
      const result = await controller.getProfile(req);
      expect(result).toEqual(profile);
      expect(mockAdminService.getProfile).toHaveBeenCalledWith('1');
    });
  });

  describe('updateProfile', () => {
    it('should update profile', async () => {
      const profile = { id: '1', name: 'Admin' };
      mockAdminService.updateProfile.mockResolvedValue(profile);

      const req = { admin: { id: '1' } } as any;
      const dto = { name: 'Admin' };
      const result = await controller.updateProfile(req, dto);
      expect(result).toEqual(profile);
      expect(mockAdminService.updateProfile).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('changePassword', () => {
    it('should change password', async () => {
      const response = { message: 'Password updated successfully' };
      mockAdminService.changePassword.mockResolvedValue(response);

      const req = { admin: { id: '1' } } as any;
      const dto = { oldPassword: 'old', newPassword: 'new' };
      const result = await controller.changePassword(req, dto);
      expect(result).toEqual(response);
      expect(mockAdminService.changePassword).toHaveBeenCalledWith('1', dto);
    });
  });
});
