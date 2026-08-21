import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
}

@Injectable()
export class TurnstileService {
  private readonly logger = new Logger(TurnstileService.name);
  private readonly secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.secretKey =
      this.configService.get<string>('cloudflare.turnstileSecretKey') || '';
  }

  isConfigured(): boolean {
    return (
      !!this.secretKey &&
      !this.secretKey.startsWith('1x0000000000000000000000000000000AA')
    );
  }

  async verify(token: string, remoteIp?: string): Promise<boolean> {
    if (!this.secretKey) {
      this.logger.warn(
        'Turnstile secret key is not configured, skipping verification.',
      );
      return true;
    }

    if (this.secretKey.startsWith('1x0000000000000000000000000000000AA')) {
      this.logger.debug('Skipping Turnstile in dev environment');
      return true;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('secret', this.secretKey);
      formData.append('response', token);
      if (remoteIp) {
        formData.append('remoteip', remoteIp);
      }

      const res = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = (await res.json()) as TurnstileResponse;
      if (data.success) {
        return true;
      }

      this.logger.warn(
        `Turnstile verification failed: ${JSON.stringify(data['error-codes'])}`,
      );
      return false;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error verifying Turnstile token: ${msg}`);
      return false;
    }
  }
}
