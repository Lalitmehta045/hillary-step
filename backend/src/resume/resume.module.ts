import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { S3Service } from './s3.service';

import { ScannerService } from './scanner.service';
import { ParserService } from './parser.service';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [SecurityModule],
  controllers: [ResumeController],
  providers: [ResumeService, S3Service, ScannerService, ParserService],
  exports: [ResumeService, S3Service, ParserService],
})
export class ResumeModule {}
