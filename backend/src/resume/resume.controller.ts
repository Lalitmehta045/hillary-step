import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  BadRequestException,
  PayloadTooLargeException,
  UseGuards,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { ParseUuidPipe } from '../common/pipes/parse-uuid.pipe';
import { TurnstileGuard } from '../security/turnstile.guard';
import type { FastifyRequest } from 'fastify';
import * as path from 'path';

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

@Controller()
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @UseGuards(TurnstileGuard)
  @Post('applications/upload-resume')
  async uploadResume(@Req() req: FastifyRequest) {
    if (!req.isMultipart()) {
      throw new BadRequestException('Request is not multipart');
    }

    const data = await req.file();
    if (!data) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file extension before reading the full buffer
    const ext = path.extname(data.filename).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new BadRequestException(
        `Invalid file extension "${ext}". Only PDF and DOC/DOCX are allowed.`,
      );
    }

    let buffer: Buffer;
    try {
      buffer = await data.toBuffer();
    } catch (err: unknown) {
      // Fastify multipart throws when file exceeds limits
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('too large') || message.includes('limit')) {
        throw new PayloadTooLargeException('File exceeds the 5MB size limit');
      }
      throw new BadRequestException('Failed to process uploaded file');
    }

    this.resumeService.validateFile(buffer, data.mimetype, buffer.length);

    // Default applicationId since it wasn't specified how to retrieve it
    const applicationId = 'default-app-id';
    const key = await this.resumeService.uploadResume(
      buffer,
      data.mimetype,
      data.filename,
      applicationId,
    );
    const parsedData = await this.resumeService.parseResume(
      buffer,
      data.mimetype,
    );

    return {
      key,
      parsedData,
      fileName: data.filename,
      fileSize: buffer.length,
      mimeType: data.mimetype,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  @Get('admin/applications/:id/documents/:docId/download')
  async downloadResume(
    @Param('id', ParseUuidPipe) applicationId: string,
    @Param('docId', ParseUuidPipe) documentId: string,
  ) {
    const url = await this.resumeService.getSecurePresignedUrl(
      applicationId,
      documentId,
    );
    return { url };
  }
}
