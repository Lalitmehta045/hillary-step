import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { AuthGuard } from '../common/guards/auth.guard';
import {
  CreateJobDto,
  AdminCreateJobDto,
  UpdateJobDto,
  UpdateJobStatusDto,
  JobFilterDto,
} from './dto/jobs.dto';

@ApiTags('Jobs')
@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

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
