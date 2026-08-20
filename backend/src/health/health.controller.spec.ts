import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock') },
        },
        {
          provide: PrismaService,
          useValue: { $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]) },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return ok status', () => {
    const res = controller.check();
    expect(res.status).toBe('ok');
    expect(res.timestamp).toBeDefined();
  });
});
