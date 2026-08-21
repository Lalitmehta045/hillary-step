import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EnquiryStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum EnquiryPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export class CreateEnquiryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  serviceRequired?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectDetails?: string;
}

export class UpdateEnquiryStatusDto {
  @ApiProperty({ enum: EnquiryStatus })
  @IsEnum(EnquiryStatus)
  status: EnquiryStatus;
}

export class UpdateEnquiryPriorityDto {
  @ApiProperty({ enum: EnquiryPriority })
  @IsEnum(EnquiryPriority)
  priority: EnquiryPriority;
}

export class EnquiryFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: EnquiryStatus })
  @IsOptional()
  @IsEnum(EnquiryStatus)
  status?: EnquiryStatus;

  @ApiPropertyOptional({ description: 'Region: USA | IND | AUS' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({
    description: 'Date preset: today | 7d | 30d | 90d',
  })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;
}
