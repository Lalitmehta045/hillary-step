import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TurnstileGuard } from './turnstile.guard';
import { TurnstileService } from './turnstile.service';

describe('TurnstileGuard', () => {
  let guard: TurnstileGuard;
  let service: TurnstileService;

  const mockTurnstileService = {
    verify: jest.fn(),
    isConfigured: jest.fn().mockReturnValue(true),
  };

  beforeEach(() => {
    service = mockTurnstileService as any;
    guard = new TurnstileGuard(service);
    mockTurnstileService.isConfigured.mockReturnValue(true);
  });

  const mockExecutionContext = (headers: any, body: any, clientIp: string) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ headers, body, clientIp }),
      }),
    }) as ExecutionContext;

  it('should bypass verification if Turnstile is not configured', async () => {
    mockTurnstileService.isConfigured.mockReturnValue(false);
    const ctx = mockExecutionContext({}, {}, '127.0.0.1');
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
  });

  it('should pass if token is valid (header)', async () => {
    mockTurnstileService.verify.mockResolvedValue(true);
    const ctx = mockExecutionContext(
      { 'cf-turnstile-response': 'token' },
      {},
      '127.0.0.1',
    );

    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect(service.verify).toHaveBeenCalledWith('token', '127.0.0.1');
  });

  it('should pass if token is valid (body)', async () => {
    mockTurnstileService.verify.mockResolvedValue(true);
    const ctx = mockExecutionContext(
      {},
      { 'cf-turnstile-response': 'token' },
      '127.0.0.1',
    );

    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect(service.verify).toHaveBeenCalledWith('token', '127.0.0.1');
  });

  it('should throw ForbiddenException if token is missing', async () => {
    const ctx = mockExecutionContext({}, {}, '127.0.0.1');
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if verification fails', async () => {
    mockTurnstileService.verify.mockResolvedValue(false);
    const ctx = mockExecutionContext(
      { 'cf-turnstile-response': 'invalid' },
      {},
      '127.0.0.1',
    );
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });
});
