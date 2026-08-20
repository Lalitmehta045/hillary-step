import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { AuthGuard } from '../common/guards/auth.guard';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    logout: jest.fn(),
    verifyMfa: jest.fn(),
    verifyRecoveryCode: jest.fn(),
    generateMfaEnrollment: jest.fn(),
    enableMfa: jest.fn(),
    disableMfa: jest.fn(),
  };

  const mockMfaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MfaService, useValue: mockMfaService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
