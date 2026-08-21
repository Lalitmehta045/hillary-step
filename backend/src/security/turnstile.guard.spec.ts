import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TurnstileGuard } from './turnstile.guard';
import { TurnstileService } from './turnstile.service';

describe('TurnstileGuard', () => {
  let guard: TurnstileGuard;
  let service: TurnstileService;

  const mockTurnstileService = {
    verify: jest.fn(),
    verifyDetailed: jest.fn(),
    isConfigured: jest.fn().mockReturnValue(true),
  };

  beforeEach(() => {
    service = mockTurnstileService as any;
    guard = new TurnstileGuard(service);
    mockTurnstileService.isConfigured.mockReturnValue(true);
    mockTurnstileService.verify.mockReset();
    mockTurnstileService.verifyDetailed.mockReset();
    mockTurnstileService.verifyDetailed.mockResolvedValue({
      success: true,
      errorCodes: [],
    });
  });

  const mockExecutionContext = (headers: any, body: any, clientIp: string) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ headers, body, clientIp }),
      }),
    }) as ExecutionContext;

  it('Turnstile not configured → upload allowed (bypass)', async () => {
    mockTurnstileService.isConfigured.mockReturnValue(false);
    const ctx = mockExecutionContext({}, {}, '127.0.0.1');
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect(service.verifyDetailed).not.toHaveBeenCalled();
  });

  it('Turnstile configured + valid token (header) → upload allowed', async () => {
    mockTurnstileService.verifyDetailed.mockResolvedValue({
      success: true,
      errorCodes: [],
    });
    const ctx = mockExecutionContext(
      { 'cf-turnstile-response': 'valid-token' },
      {},
      '127.0.0.1',
    );

    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect(service.verifyDetailed).toHaveBeenCalledWith('valid-token');
  });

  it('Turnstile configured + valid token (body) → allowed', async () => {
    mockTurnstileService.verifyDetailed.mockResolvedValue({
      success: true,
      errorCodes: [],
    });
    const ctx = mockExecutionContext(
      {},
      { 'cf-turnstile-response': 'valid-token' },
      '127.0.0.1',
    );

    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect(service.verifyDetailed).toHaveBeenCalledWith('valid-token');
  });

  it('Turnstile configured + missing token → 403 Turnstile token is required', async () => {
    const ctx = mockExecutionContext({}, {}, '127.0.0.1');
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(ctx)).rejects.toThrow(
      'Turnstile token is required',
    );
    expect(service.verifyDetailed).not.toHaveBeenCalled();
  });

  it('Turnstile configured + empty/whitespace token → 403', async () => {
    const ctx = mockExecutionContext(
      { 'cf-turnstile-response': '   ' },
      {},
      '127.0.0.1',
    );
    await expect(guard.canActivate(ctx)).rejects.toThrow(
      'Turnstile token is required',
    );
  });

  it('Turnstile configured + invalid token → 403 Turnstile verification failed', async () => {
    mockTurnstileService.verifyDetailed.mockResolvedValue({
      success: false,
      errorCodes: ['invalid-input-response'],
    });
    const ctx = mockExecutionContext(
      { 'cf-turnstile-response': 'invalid' },
      {},
      '127.0.0.1',
    );
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(ctx)).rejects.toThrow(
      'Turnstile verification failed (invalid-input-response)',
    );
  });
});
