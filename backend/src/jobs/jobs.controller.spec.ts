import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { ResumeService } from '../resume/resume.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { TurnstileGuard } from '../security/turnstile.guard';
import { NotFoundException } from '@nestjs/common';

describe('JobsController', () => {
  let controller: JobsController;

  const mockJobsService = {
    findPublished: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockResumeService = {
    validateFile: jest.fn(),
    uploadJobDocument: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        { provide: JobsService, useValue: mockJobsService },
        { provide: ResumeService, useValue: mockResumeService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(TurnstileGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<JobsController>(JobsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findPublished', () => {
    it('should return published jobs', async () => {
      const filters = {};
      mockJobsService.findPublished.mockResolvedValue('result');
      const result = await controller.findPublished(filters);
      expect(result).toBe('result');
      expect(mockJobsService.findPublished).toHaveBeenCalledWith(filters);
    });
  });

  describe('getPublicJob', () => {
    it('should return job if status is PUBLISHED', async () => {
      const job = { id: '1', status: 'PUBLISHED' };
      mockJobsService.findOne.mockResolvedValue(job);
      const result = await controller.getPublicJob('1');
      expect(result).toBe(job);
    });

    it('should throw NotFoundException if status is not PUBLISHED', async () => {
      const job = { id: '1', status: 'DRAFT' };
      mockJobsService.findOne.mockResolvedValue(job);
      await expect(controller.getPublicJob('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createPublicJob', () => {
    it('should create a public job', async () => {
      const dto = { jobTitle: 'Test' } as any;
      mockJobsService.create.mockResolvedValue('result');
      const result = await controller.createPublicJob(dto);
      expect(result).toBe('result');
      expect(mockJobsService.create).toHaveBeenCalledWith(dto, false);
    });
  });

  describe('findAll', () => {
    it('should return all jobs for admin', async () => {
      const filters = {};
      mockJobsService.findAll.mockResolvedValue('result');
      const result = await controller.findAll(filters);
      expect(result).toBe('result');
      expect(mockJobsService.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('getAdminJob', () => {
    it('should return any job for admin', async () => {
      const job = { id: '1', status: 'DRAFT' };
      mockJobsService.findOne.mockResolvedValue(job);
      const result = await controller.getAdminJob('1');
      expect(result).toBe(job);
      expect(mockJobsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('createAdminJob', () => {
    it('should create an admin job (default isPublic false)', async () => {
      const dto = { jobTitle: 'Test' } as any;
      mockJobsService.create.mockResolvedValue('result');
      const result = await controller.createAdminJob(dto);
      expect(result).toBe('result');
      expect(mockJobsService.create).toHaveBeenCalledWith(dto, false);
    });

    it('should create an admin job with isPublic from dto', async () => {
      const dto = { jobTitle: 'Test', isPublic: true } as any;
      mockJobsService.create.mockResolvedValue('result');
      const result = await controller.createAdminJob(dto);
      expect(result).toBe('result');
      expect(mockJobsService.create).toHaveBeenCalledWith(dto, true);
    });
  });

  describe('update', () => {
    it('should update a job', async () => {
      const dto = { jobTitle: 'Updated' } as any;
      mockJobsService.update.mockResolvedValue('result');
      const result = await controller.update('1', dto);
      expect(result).toBe('result');
      expect(mockJobsService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a job', async () => {
      mockJobsService.remove.mockResolvedValue('result');
      const result = await controller.remove('1');
      expect(result).toBe('result');
      expect(mockJobsService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('updateStatus', () => {
    it('should update job status', async () => {
      const dto = { status: 'CLOSED' } as any;
      mockJobsService.updateStatus.mockResolvedValue('result');
      const result = await controller.updateStatus('1', dto);
      expect(result).toBe('result');
      expect(mockJobsService.updateStatus).toHaveBeenCalledWith('1', 'CLOSED');
    });
  });
});
