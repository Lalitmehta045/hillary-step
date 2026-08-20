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

export enum ApplicationStatus {
  NEW = 'NEW',
  REVIEWING = 'REVIEWING',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW = 'INTERVIEW',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
}

export class CreateApplicationDto {
  @ApiProperty()
  @IsString()
  fullName: string;

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
  linkedinProfile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentDesignation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  practice?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  experienceYears?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preferredLocation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverNote?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resumeFileKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resumeFileName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  resumeFileSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resumeMimeType?: string;
}

export class UpdateApplicationStatusDto {
  @ApiProperty({ enum: ApplicationStatus })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}

export class CreateNoteDto {
  @ApiProperty()
  @IsString()
  content: string;
}

export class ApplicationFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ApplicationStatus })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

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
