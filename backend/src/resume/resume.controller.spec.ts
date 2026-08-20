import { Test, TestingModule } from '@nestjs/testing';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { BadRequestException } from '@nestjs/common';
import { TurnstileGuard } from '../security/turnstile.guard';
import type { FastifyRequest } from 'fastify';

describe('ResumeController', () => {
  let controller: ResumeController;
  let resumeService: jest.Mocked<ResumeService>;

  beforeEach(async () => {
    const mockResumeService = {
      validateFile: jest.fn(),
      uploadResume: jest.fn().mockReturnValue('resumes/app/123.pdf'),
      parseResume: jest.fn().mockResolvedValue({ skills: ['Jest'] }),
      getPresignedUrl: jest.fn().mockReturnValue('https://s3.url'),
      getSecurePresignedUrl: jest.fn().mockResolvedValue('https://s3.url'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumeController],
      providers: [
        {
          provide: ResumeService,
          useValue: mockResumeService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(TurnstileGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ResumeController>(ResumeController);
    resumeService = module.get(ResumeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadResume', () => {
    it('should throw BadRequestException if request is not multipart', async () => {
      const req = {
        isMultipart: () => false,
      } as FastifyRequest;

      await expect(controller.uploadResume(req)).rejects.toThrow(
        new BadRequestException('Request is not multipart'),
      );
    });

    it('should throw BadRequestException if no file is uploaded', async () => {
      const req = {
        isMultipart: () => true,
        file: () => Promise.resolve(undefined),
      } as any as FastifyRequest;

      await expect(controller.uploadResume(req)).rejects.toThrow(
        new BadRequestException('No file uploaded'),
      );
    });

    it('should process a valid resume file upload', async () => {
      const mockBuffer = Buffer.from('test');
      const mockFile = {
        toBuffer: () => Promise.resolve(mockBuffer),
        mimetype: 'application/pdf',
        filename: 'resume.pdf',
      };
      const req = {
        isMultipart: () => true,
        file: () => Promise.resolve(mockFile),
      } as any as FastifyRequest;

      resumeService.validateFile.mockReturnValue(undefined);
      resumeService.uploadResume.mockResolvedValue('resumes/app/123.pdf');
      resumeService.parseResume.mockResolvedValue({ skills: ['Jest'] });

      const result = await controller.uploadResume(req);

      expect(resumeService.validateFile).toHaveBeenCalledWith(
        mockBuffer,
        'application/pdf',
        mockBuffer.length,
      );
      expect(resumeService.uploadResume).toHaveBeenCalledWith(
        mockBuffer,
        'application/pdf',
        'resume.pdf',
        'default-app-id',
      );
      expect(resumeService.parseResume).toHaveBeenCalledWith(
        mockBuffer,
        'application/pdf',
      );
      expect(result).toEqual({
        fileName: 'resume.pdf',
        fileSize: 4,
        key: 'resumes/app/123.pdf',
        mimeType: 'application/pdf',
        parsedData: { skills: ['Jest'] },
      });
    });
  });

  describe('downloadResume', () => {
    it('should return a presigned url via secure method', async () => {
      resumeService.getSecurePresignedUrl.mockResolvedValue(
        'http://presigned.url',
      );
      const result = await controller.downloadResume(
        '00000000-0000-4000-8000-000000000001',
        '00000000-0000-4000-8000-000000000002',
      );
      expect(resumeService.getSecurePresignedUrl).toHaveBeenCalledWith(
        '00000000-0000-4000-8000-000000000001',
        '00000000-0000-4000-8000-000000000002',
      );
      expect(result).toEqual({ url: 'http://presigned.url' });
    });
  });
});
