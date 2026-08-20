import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { ResumeModule } from './resume/resume.module';
import { ContactModule } from './contact/contact.module';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    HealthModule,
    AuditModule,
    AuthModule,
    AdminModule,
    JobsModule,
    ApplicationsModule,
    ResumeModule,
    ContactModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
