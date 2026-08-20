import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/admin.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('settings/profile')
  @ApiOperation({ summary: 'Get admin profile' })
  getProfile(
    @Req() req: import('fastify').FastifyRequest & { admin: { id: string } },
  ) {
    return this.adminService.getProfile(req.admin.id);
  }

  @Patch('settings/profile')
  @ApiOperation({ summary: 'Update admin profile' })
  updateProfile(
    @Req() req: import('fastify').FastifyRequest & { admin: { id: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.adminService.updateProfile(req.admin.id, dto);
  }

  @Post('settings/change-password')
  @ApiOperation({ summary: 'Change admin password' })
  changePassword(
    @Req() req: import('fastify').FastifyRequest & { admin: { id: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.adminService.changePassword(req.admin.id, dto);
  }
}
