import {
  Injectable,
  BadRequestException,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { ScannerService } from './scanner.service';
import { ParserService } from './parser.service';
import { PrismaService } from '../database/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);
  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB

  constructor(
    private readonly s3Service: S3Service,
    private readonly scannerService: ScannerService,
    private readonly prisma: PrismaService,
    private readonly parserService: ParserService,
  ) {}

  validateFile(buffer: Buffer, mimetype: string, size: number): void {
    if (size > this.MAX_SIZE) {
      throw new BadRequestException('File exceeds 5MB limit');
    }

    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedMimeTypes.includes(mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF and DOC/DOCX are allowed.',
      );
    }

    // Validate magic bytes
    if (buffer.length < 4)
      throw new BadRequestException('Invalid file content');

    const hex = buffer.toString('hex', 0, 4).toUpperCase();
    const isPdf = hex.startsWith('25504446');
    const isDoc = hex.startsWith('D0CF11E0');
    const isDocx = hex.startsWith('504B0304');

    if (!isPdf && !isDoc && !isDocx) {
      throw new BadRequestException('Invalid file magic bytes');
    }
  }

  async uploadResume(
    buffer: Buffer,
    mimetype: string,
    originalName: string,
    applicationId: string,
  ): Promise<string> {
    const ext =
      path.extname(originalName).toLowerCase() ||
      (mimetype === 'application/pdf' ? '.pdf' : '.docx');
    const uuid = uuidv4();
    const cleanKey = `resumes/${applicationId}/${uuid}${ext}`;

    // 1. Malware Scan synchronously before any storage
    let isClean = false;
    try {
      isClean = await this.scannerService.scanBuffer(buffer);
    } catch (err) {
      // UNSCANNED: MUST NOT reach storage or parser
      this.logger.error('Scanner failed or unavailable', err);
      throw new InternalServerErrorException(
        'Malware scanner is currently unavailable. Upload aborted.',
      );
    }

    if (!isClean) {
      // INFECTED: reject, prevent parsing, audit security event
      this.logger.warn(
        `SECURITY EVENT: Malware detected in upload for application ${applicationId}`,
      );
      throw new BadRequestException(
        'Security violation: Malware detected in uploaded file',
      );
    }

    // 2. CLEAN: upload to actual resumes directory
    await this.s3Service.upload(cleanKey, buffer, mimetype);

    return cleanKey;
  }

  async getPresignedUrl(fileKey: string): Promise<string> {
    return this.s3Service.getPresignedUrl(fileKey);
  }

  /**
   * Generates a presigned URL for a document after verifying that the
   * document exists and belongs to the specified application.
   * This prevents IDOR/BOLA by ensuring an admin cannot access
   * documents belonging to a different application by manipulating IDs.
   */
  async getSecurePresignedUrl(
    applicationId: string,
    documentId: string,
  ): Promise<string> {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.applicationId !== applicationId) {
      throw new ForbiddenException(
        'Access denied: document does not belong to this application',
      );
    }

    return this.s3Service.getPresignedUrl(document.fileKey);
  }

  async parseResume(
    buffer: Buffer,
    mimetype: string,
  ): Promise<Record<string, unknown>> {
    this.logger.log(`Parsing resume`);
    const text = await this.parserService.extractText(buffer, mimetype);
    const parsedData = this.parserService.parseStructuredData(text);
    return parsedData as unknown as Record<string, unknown>;
  }
}
