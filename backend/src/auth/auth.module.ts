import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SessionService } from './session.service';
import { MfaService } from './mfa.service';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, SessionService, MfaService],
  exports: [AuthService, SessionService],
})
export class AuthModule {}
