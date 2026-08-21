import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { DatabaseModule } from '../database/database.module';
import { ResumeModule } from '../resume/resume.module';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [DatabaseModule, ResumeModule, SecurityModule],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
