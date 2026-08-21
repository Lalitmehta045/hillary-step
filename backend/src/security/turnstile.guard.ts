import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { TurnstileService } from './turnstile.service';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class TurnstileGuard implements CanActivate {
  constructor(private readonly turnstileService: TurnstileService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      this.turnstileService.isConfigured &&
      !this.turnstileService.isConfigured()
    ) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<FastifyRequest & { clientIp?: string }>();
    const body = request.body as Record<string, unknown> | undefined;

    const token =
      request.headers['cf-turnstile-response'] ||
      body?.['cf-turnstile-response'];
    const clientIp = request.clientIp || request.ip;

    if (!token || typeof token !== 'string') {
      throw new ForbiddenException('Turnstile token is required');
    }

    const isValid = await this.turnstileService.verify(token, clientIp);
    if (!isValid) {
      throw new ForbiddenException('Turnstile verification failed');
    }

    return true;
  }
}
