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
import { ContactService } from './contact.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { ClientIp } from '../common/decorators/client-ip.decorator';
import {
  CreateEnquiryDto,
  UpdateEnquiryStatusDto,
  UpdateEnquiryPriorityDto,
  EnquiryFilterDto,
} from './dto/contact.dto';

@ApiTags('Contact')
@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('contact')
  @ApiOperation({ summary: 'Submit a public enquiry/contact form' })
  async createContact(@Body() dto: CreateEnquiryDto, @ClientIp() ip: string) {
    return this.contactService.create(dto, ip);
  }

  @UseGuards(AuthGuard)
  @Get('admin/enquiries')
  @ApiOperation({ summary: 'Admin: List all enquiries' })
  async findAll(@Query() filters: EnquiryFilterDto) {
    return this.contactService.findAll(filters);
  }

  @UseGuards(AuthGuard)
  @Get('admin/enquiries/:id')
  @ApiOperation({ summary: 'Admin: Get single enquiry detail' })
  async findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch('admin/enquiries/:id/status')
  @ApiOperation({ summary: 'Admin: Update enquiry status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateEnquiryStatusDto,
  ) {
    return this.contactService.updateStatus(id, dto.status);
  }

  @UseGuards(AuthGuard)
  @Patch('admin/enquiries/:id/priority')
  @ApiOperation({ summary: 'Admin: Update enquiry priority' })
  async updatePriority(
    @Param('id') id: string,
    @Body() dto: UpdateEnquiryPriorityDto,
  ) {
    return this.contactService.updatePriority(id, dto.priority);
  }
}
