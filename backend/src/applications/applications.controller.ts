import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ClientIp } from '../common/decorators/client-ip.decorator';
import { CurrentAdmin } from '../common/decorators/current-admin.decorator';
import { AdminRole } from '@prisma/client';
import { TurnstileGuard } from '../security/turnstile.guard';
import type { Admin } from '@prisma/client';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
  CreateNoteDto,
  ApplicationFilterDto,
} from './dto/applications.dto';

@ApiTags('Applications')
@Controller()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(TurnstileGuard)
  @Post('applications')
  @ApiOperation({ summary: 'Public: Submit an application' })
  async create(@Body() dto: CreateApplicationDto, @ClientIp() ip: string) {
    return this.applicationsService.create(dto, ip);
  }

  @UseGuards(AuthGuard)
  @Get('admin/applications')
  @ApiOperation({ summary: 'Admin: List all applications' })
  async findAll(@Query() filters: ApplicationFilterDto) {
    return this.applicationsService.findAll(filters);
  }

  @UseGuards(AuthGuard)
  @Get('admin/applications/:id')
  @ApiOperation({ summary: 'Admin: Get single application detail' })
  async findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch('admin/applications/:id/status')
  @ApiOperation({ summary: 'Admin: Update application status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @CurrentAdmin() admin: Admin,
  ) {
    return this.applicationsService.updateStatus(id, dto.status, admin.id);
  }

  @UseGuards(AuthGuard)
  @Post('admin/applications/:id/notes')
  @ApiOperation({ summary: 'Admin: Add internal note' })
  async addNote(
    @Param('id') id: string,
    @Body() dto: CreateNoteDto,
    @CurrentAdmin() admin: Admin,
  ) {
    return this.applicationsService.addNote(id, admin.id, dto.content);
  }

  @UseGuards(AuthGuard)
  @Get('admin/applications/:id/notes')
  @ApiOperation({ summary: 'Admin: Get notes for application' })
  async getNotes(@Param('id') id: string) {
    return this.applicationsService.getNotes(id);
  }

  @UseGuards(AuthGuard)
  @Get('admin/applications/:id/activity')
  @ApiOperation({ summary: 'Admin: Get activity log' })
  async getActivity(@Param('id') id: string) {
    return this.applicationsService.getActivity(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  @Get('admin/applications/:id/documents')
  @ApiOperation({ summary: 'Admin: Get documents list' })
  async getDocuments(@Param('id') id: string) {
    return this.applicationsService.getDocuments(id);
  }
}
