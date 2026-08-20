import { Test, TestingModule } from '@nestjs/testing';
import { ResumeService } from './resume.service';
import { S3Service } from './s3.service';
import { ScannerService } from './scanner.service';
import { PrismaService } from '../database/prisma.service';
import { ParserService } from './parser.service';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

describe('ResumeService', () => {
  let service: ResumeService;
  let s3Service: jest.Mocked<S3Service>;
  let parserService: jest.Mocked<ParserService>;
  let prismaService: { document: { findUnique: jest.Mock } };

  beforeEach(async () => {
    const mockS3Service = {
      upload: jest.fn(),
      getPresignedUrl: jest.fn(),
    };

    const mockScannerService = {
      scanBuffer: jest.fn().mockResolvedValue(true),
    };

    const mockParserService = {
      extractText: jest.fn(),
      parseStructuredData: jest.fn(),
    };

    prismaService = {
      document: { findUnique: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumeService,
        { provide: S3Service, useValue: mockS3Service },
        { provide: ScannerService, useValue: mockScannerService },
        { provide: PrismaService, useValue: prismaService },
        { provide: ParserService, useValue: mockParserService },
      ],
    }).compile();

    service = module.get<ResumeService>(ResumeService);
    s3Service = module.get(S3Service);
    parserService = module.get(ParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateFile', () => {
    it('should throw BadRequestException if file size exceeds 5MB', () => {
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024);
      expect(() =>
        service.validateFile(largeBuffer, 'application/pdf', 6 * 1024 * 1024),
      ).toThrow(new BadRequestException('File exceeds 5MB limit'));
    });

    it('should throw BadRequestException for invalid mime types', () => {
      const buffer = Buffer.alloc(10);
      expect(() => service.validateFile(buffer, 'image/jpeg', 10)).toThrow(
        new BadRequestException(
          'Invalid file type. Only PDF and DOC/DOCX are allowed.',
        ),
      );
    });

    it('should throw BadRequestException if buffer length is less than 4', () => {
      const buffer = Buffer.alloc(3);
      expect(() => service.validateFile(buffer, 'application/pdf', 3)).toThrow(
        new BadRequestException('Invalid file content'),
      );
    });

    it('should throw BadRequestException for invalid magic bytes', () => {
      const buffer = Buffer.from('12345678', 'hex');
      expect(() => service.validateFile(buffer, 'application/pdf', 4)).toThrow(
        new BadRequestException('Invalid file magic bytes'),
      );
    });

    it('should pass validation for a valid PDF file', () => {
      const pdfBuffer = Buffer.from('25504446', 'hex'); // %PDF
      expect(() =>
        service.validateFile(pdfBuffer, 'application/pdf', 4),
      ).not.toThrow();
    });

    it('should pass validation for a valid DOC file', () => {
      const docBuffer = Buffer.from('D0CF11E0', 'hex');
      expect(() =>
        service.validateFile(docBuffer, 'application/msword', 4),
      ).not.toThrow();
    });

    it('should pass validation for a valid DOCX file', () => {
      const docxBuffer = Buffer.from('504B0304', 'hex');
      expect(() =>
        service.validateFile(
          docxBuffer,
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          4,
        ),
      ).not.toThrow();
    });
  });

  describe('uploadResume', () => {
    it('should upload resume to S3 and return a valid key', async () => {
      const buffer = Buffer.from('test content');
      s3Service.upload.mockResolvedValue(undefined);

      const key = await service.uploadResume(
        buffer,
        'application/pdf',
        'resume.pdf',
        'app123',
      );

      expect(s3Service.upload).toHaveBeenCalled();
      expect(key).toMatch(/^resumes\/app123\/[0-9a-fA-F-]+\.pdf$/);
    });

    it('should fallback to .pdf extension if originalName has no extension', async () => {
      const buffer = Buffer.from('test content');
      s3Service.upload.mockResolvedValue(undefined);

      const key = await service.uploadResume(
        buffer,
        'application/pdf',
        'resume',
        'app123',
      );

      expect(key).toMatch(/\.pdf$/);
    });

    it('should fallback to .docx extension if originalName has no extension and mimetype is not pdf', async () => {
      const buffer = Buffer.from('test content');
      s3Service.upload.mockResolvedValue(undefined);

      const key = await service.uploadResume(
        buffer,
        'application/msword',
        'resume',
        'app123',
      );

      expect(key).toMatch(/\.docx$/);
    });
  });

  describe('getPresignedUrl', () => {
    it('should return a presigned url from s3 service', async () => {
      s3Service.getPresignedUrl.mockResolvedValue('http://presigned-url.com');
      const url = await service.getPresignedUrl('some/key.pdf');
      expect(s3Service.getPresignedUrl).toHaveBeenCalledWith('some/key.pdf');
      expect(url).toBe('http://presigned-url.com');
    });
  });

  describe('getSecurePresignedUrl', () => {
    const applicationId = '00000000-0000-4000-8000-000000000001';
    const documentId = '00000000-0000-4000-8000-000000000002';
    const fileKey = 'resumes/app/uuid.pdf';

    it('should return a presigned url when document belongs to application', async () => {
      prismaService.document.findUnique.mockResolvedValue({
        id: documentId,
        applicationId,
        fileKey,
        fileName: 'resume.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
      });
      s3Service.getPresignedUrl.mockResolvedValue('http://presigned.url');

      const url = await service.getSecurePresignedUrl(
        applicationId,
        documentId,
      );

      expect(prismaService.document.findUnique).toHaveBeenCalledWith({
        where: { id: documentId },
      });
      expect(s3Service.getPresignedUrl).toHaveBeenCalledWith(fileKey);
      expect(url).toBe('http://presigned.url');
    });

    it('should throw NotFoundException when document does not exist', async () => {
      prismaService.document.findUnique.mockResolvedValue(null);

      await expect(
        service.getSecurePresignedUrl(applicationId, documentId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when document belongs to different application (IDOR prevention)', async () => {
      prismaService.document.findUnique.mockResolvedValue({
        id: documentId,
        applicationId: '00000000-0000-4000-8000-000000000099',
        fileKey,
        fileName: 'resume.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
      });

      await expect(
        service.getSecurePresignedUrl(applicationId, documentId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('parseResume', () => {
    it('should return parsed resume data', async () => {
      parserService.extractText.mockResolvedValue('Mock resume text');
      parserService.parseStructuredData.mockReturnValue({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: null,
        linkedinUrl: null,
        portfolioUrl: null,
        practice: null,
        preferredLocation: null,
        skills: null,
        experience: null,
        education: null,
      });

      const buffer = Buffer.from('test');
      const result = await service.parseResume(buffer, 'application/pdf');

      expect(parserService.extractText).toHaveBeenCalledWith(
        buffer,
        'application/pdf',
      );
      expect(parserService.parseStructuredData).toHaveBeenCalledWith(
        'Mock resume text',
      );
      expect(result).toEqual({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: null,
        linkedinUrl: null,
        portfolioUrl: null,
        practice: null,
        preferredLocation: null,
        skills: null,
        experience: null,
        education: null,
      });
    });
  });
});
