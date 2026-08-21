import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { TurnstileService } from './turnstile.service';
import type { FastifyRequest } from 'fastify';

function extractTurnstileToken(
  headers: FastifyRequest['headers'],
  body: Record<string, unknown> | undefined,
): string | undefined {
  const raw =
    headers['cf-turnstile-response'] ?? body?.['cf-turnstile-response'];

  if (Array.isArray(raw)) {
    const first = raw.find((v) => typeof v === 'string' && v.trim());
    return first?.trim();
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    return trimmed || undefined;
  }

  return undefined;
}

@Injectable()
export class TurnstileGuard implements CanActivate {
  constructor(private readonly turnstileService: TurnstileService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip only when the secret key is genuinely absent (or Cloudflare test key).
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

    // Prefer header: multipart body is not parsed before this guard runs on upload-resume.
    const token = extractTurnstileToken(request.headers, body);
    const clientIp = request.clientIp || request.ip;

    if (!token) {
      throw new ForbiddenException('Turnstile token is required');
    }

    const isValid = await this.turnstileService.verify(token, clientIp);
    if (!isValid) {
      throw new ForbiddenException('Turnstile verification failed');
    }

    return true;
  }
}
