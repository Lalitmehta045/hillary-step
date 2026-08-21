import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  NotFoundException,
  BadRequestException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { ResumeService } from '../resume/resume.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { TurnstileGuard } from '../security/turnstile.guard';
import {
  CreateJobDto,
  AdminCreateJobDto,
  UpdateJobDto,
  UpdateJobStatusDto,
  JobFilterDto,
} from './dto/jobs.dto';
import type { FastifyRequest } from 'fastify';
import * as path from 'path';

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

@ApiTags('Jobs')
@Controller()
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly resumeService: ResumeService,
  ) {}

  @Get('jobs')
  @ApiOperation({ summary: 'Public: List published jobs' })
  async findPublished(@Query() filters: JobFilterDto) {
    return this.jobsService.findPublished(filters);
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Public: Get published job detail' })
  async getPublicJob(@Param('id') id: string) {
    const job = await this.jobsService.findOne(id);
    if (job.status !== 'PUBLISHED')
      throw new NotFoundException('Job not found');
    return job;
  }

  @UseGuards(TurnstileGuard)
  @Post('jobs/upload-document')
  @ApiOperation({
    summary: 'Public: Upload supporting document for Post a Job',
  })
  async uploadDocument(@Req() req: FastifyRequest) {
    if (!req.isMultipart()) {
      throw new BadRequestException('Request is not multipart');
    }

    const data = await req.file();
    if (!data) {
      throw new BadRequestException('No file uploaded');
    }

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
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('too large') || message.includes('limit')) {
        throw new PayloadTooLargeException('File exceeds the 5MB size limit');
      }
      throw new BadRequestException('Failed to process uploaded file');
    }

    this.resumeService.validateFile(buffer, data.mimetype, buffer.length);
    const key = await this.resumeService.uploadJobDocument(
      buffer,
      data.mimetype,
      data.filename,
    );

    return {
      key,
      fileName: data.filename,
      fileSize: buffer.length,
      mimeType: data.mimetype,
    };
  }

  @Post('jobs')
  @ApiOperation({ summary: 'Public: Submit "Post a Job" form' })
  async createPublicJob(@Body() dto: CreateJobDto) {
    return this.jobsService.create(dto, false);
  }

  @UseGuards(AuthGuard)
  @Get('admin/jobs')
  @ApiOperation({ summary: 'Admin: List all jobs' })
  async findAll(@Query() filters: JobFilterDto) {
    return this.jobsService.findAll(filters);
  }

  @UseGuards(AuthGuard)
  @Get('admin/jobs/:id')
  @ApiOperation({ summary: 'Admin: Get job detail' })
  async getAdminJob(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post('admin/jobs')
  @ApiOperation({ summary: 'Admin: Create a job' })
  async createAdminJob(@Body() dto: AdminCreateJobDto) {
    return this.jobsService.create(
      dto,
      dto.isPublic !== undefined ? dto.isPublic : false,
    );
  }

  @UseGuards(AuthGuard)
  @Patch('admin/jobs/:id')
  @ApiOperation({ summary: 'Admin: Update a job' })
  async update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete('admin/jobs/:id')
  @ApiOperation({ summary: 'Admin: Soft delete a job' })
  async remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Patch('admin/jobs/:id/status')
  @ApiOperation({ summary: 'Admin: Update job status' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateJobStatusDto) {
    return this.jobsService.updateStatus(id, dto.status);
  }
}
