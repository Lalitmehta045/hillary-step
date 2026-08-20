import { Test, TestingModule } from '@nestjs/testing';
import { TurnstileService } from './turnstile.service';
import { ConfigService } from '@nestjs/config';

describe('TurnstileService', () => {
  let service: TurnstileService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurnstileService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TurnstileService>(TurnstileService);

    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should skip verification if no secret key', async () => {
    mockConfigService.get.mockReturnValue('');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurnstileService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    service = module.get<TurnstileService>(TurnstileService);

    const result = await service.verify('token');
    expect(result).toBe(true);
  });

  it('should skip verification in dev environment (dummy key)', async () => {
    mockConfigService.get.mockReturnValue(
      '1x0000000000000000000000000000000AA',
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurnstileService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    service = module.get<TurnstileService>(TurnstileService);

    const result = await service.verify('token');
    expect(result).toBe(true);
  });

  it('should verify token successfully', async () => {
    mockConfigService.get.mockReturnValue('valid-secret');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurnstileService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    service = module.get<TurnstileService>(TurnstileService);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: true }),
    });

    const result = await service.verify('token', '127.0.0.1');
    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('should fail verification if api returns false', async () => {
    mockConfigService.get.mockReturnValue('valid-secret');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurnstileService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    service = module.get<TurnstileService>(TurnstileService);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest
        .fn()
        .mockResolvedValue({ success: false, 'error-codes': ['invalid'] }),
    });

    const result = await service.verify('token');
    expect(result).toBe(false);
  });

  it('should return false on fetch error', async () => {
    mockConfigService.get.mockReturnValue('valid-secret');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurnstileService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    service = module.get<TurnstileService>(TurnstileService);

    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const result = await service.verify('token');
    expect(result).toBe(false);
  });
});
