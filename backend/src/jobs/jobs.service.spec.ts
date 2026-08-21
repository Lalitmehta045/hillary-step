import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('JobsService', () => {
  let service: JobsService;

  const mockPrismaService = {
    job: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a job successfully', async () => {
      const dto = { jobTitle: 'New Job' } as any;
      const expectedOutput = {
        id: '1',
        ...dto,
        status: 'DRAFT',
        isPublic: false,
        applicationDeadline: null,
      };
      mockPrismaService.job.create.mockResolvedValue(expectedOutput);

      const result = await service.create(dto);
      expect(result).toEqual(expectedOutput);
      expect(mockPrismaService.job.create).toHaveBeenCalledWith({
        data: {
          jobTitle: 'New Job',
          applicationDeadline: null,
          status: 'DRAFT',
          isPublic: false,
        },
      });
    });

    it('should handle applicationDeadline correctly', async () => {
      const data = {
        jobTitle: 'New Job',
        applicationDeadline: '2024-12-31T23:59:59.000Z',
        status: 'PUBLISHED' as any,
      } as any;
      const expectedOutput = { id: '1', ...data, isPublic: true };
      mockPrismaService.job.create.mockResolvedValue(expectedOutput);

      const result = await service.create(data, true);
      expect(result).toEqual(expectedOutput);
      expect(mockPrismaService.job.create).toHaveBeenCalledWith({
        data: {
          jobTitle: 'New Job',
          status: 'PUBLISHED',
          applicationDeadline: new Date('2024-12-31T23:59:59.000Z'),
          isPublic: true,
        },
      });
    });

    it('should persist uploaded documents as attachments', async () => {
      const dto = {
        jobTitle: 'New Job',
        documents: [
          {
            key: 'job-docs/abc.pdf',
            fileName: 'spec.pdf',
            fileSize: 1024,
            mimeType: 'application/pdf',
          },
        ],
      } as any;
      mockPrismaService.job.create.mockResolvedValue({ id: '1' });

      await service.create(dto);
      expect(mockPrismaService.job.create).toHaveBeenCalledWith({
        data: {
          jobTitle: 'New Job',
          applicationDeadline: null,
          status: 'DRAFT',
          isPublic: false,
          attachments: [
            {
              fileKey: 'job-docs/abc.pdf',
              fileName: 'spec.pdf',
              fileSize: 1024,
              mimeType: 'application/pdf',
            },
          ],
        },
      });
    });
  });

  describe('findAll', () => {
    it('should apply filters correctly', async () => {
      const filters = {
        page: 1,
        pageSize: 10,
        status: 'PUBLISHED' as any,
        search: 'developer',
      };
      const jobs = [{ id: '1', jobTitle: 'Test Job' }];
      mockPrismaService.job.findMany.mockResolvedValue(jobs);
      mockPrismaService.job.count.mockResolvedValue(1);

      const result = await service.findAll(filters);
      expect(result).toEqual({
        data: jobs,
        meta: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
      });
      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deletedAt: null,
            status: 'PUBLISHED',
            OR: expect.any(Array),
          }),
          skip: 0,
          take: 10,
          orderBy: { createdAt: 'desc' },
        }),
      );
    });
  });

  describe('findPublished', () => {
    it('should call findAll with PUBLISHED status', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValue('result' as any);
      await service.findPublished({ page: 2 });
      expect(spy).toHaveBeenCalledWith({ page: 2, status: 'PUBLISHED' });
    });
  });

  describe('findOne', () => {
    it('should return a job if found', async () => {
      const job = { id: '1', jobTitle: 'Test Job' };
      mockPrismaService.job.findUnique.mockResolvedValue(job);

      const result = await service.findOne('1');
      expect(result).toEqual(job);
    });

    it('should throw NotFoundException if job not found', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a job', async () => {
      const job = { id: '1', jobTitle: 'Test Job' };
      const updateData = { jobTitle: 'Updated Job' };
      mockPrismaService.job.findUnique.mockResolvedValue(job);
      mockPrismaService.job.update.mockResolvedValue({
        ...job,
        ...updateData,
      });

      const result = await service.update('1', updateData);
      expect(result.jobTitle).toBe('Updated Job');
      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
    });
  });

  describe('remove', () => {
    it('should soft delete a job', async () => {
      const job = { id: '1', jobTitle: 'Test Job' };
      mockPrismaService.job.findUnique.mockResolvedValue(job);
      mockPrismaService.job.update.mockResolvedValue({
        ...job,
        deletedAt: new Date(),
      });

      await service.remove('1');
      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });

  describe('updateStatus', () => {
    it('should update job status', async () => {
      const job = { id: '1', status: 'DRAFT' };
      mockPrismaService.job.findUnique.mockResolvedValue(job);
      mockPrismaService.job.update.mockResolvedValue({
        ...job,
        status: 'PUBLISHED',
      });

      await service.updateStatus('1', 'PUBLISHED');
      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'PUBLISHED' },
      });
    });
  });
});
