import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
}

export type TurnstileVerifyResult = {
  success: boolean;
  errorCodes: string[];
};

@Injectable()
export class TurnstileService {
  private readonly logger = new Logger(TurnstileService.name);
  private readonly secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = (
      this.configService.get<string>('cloudflare.turnstileSecretKey') || ''
    ).trim();
  }

  /**
   * True only when a real Cloudflare secret is present.
   * Empty/missing secrets and Cloudflare's always-pass test secret are not "configured".
   */
  isConfigured(): boolean {
    return (
      !!this.secretKey &&
      !this.secretKey.startsWith('1x0000000000000000000000000000000AA')
    );
  }

  /**
   * Only forward remoteip when it looks like a real public client address.
   * Private/link-local IPs from Render/Vercel proxy hops make siteverify fail
   * even when the widget already showed Success.
   */
  private shouldSendRemoteIp(remoteIp?: string): boolean {
    const ip = remoteIp?.trim();
    if (!ip) return false;
    if (
      ip === '::1' ||
      ip === '0.0.0.0' ||
      ip.startsWith('127.') ||
      ip.startsWith('10.') ||
      ip.startsWith('192.168.') ||
      ip.startsWith('169.254.') ||
      ip.startsWith('fc') ||
      ip.startsWith('fd') ||
      ip.startsWith('fe80:') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
    ) {
      return false;
    }
    return true;
  }

  async verify(token: string, remoteIp?: string): Promise<boolean> {
    const result = await this.verifyDetailed(token, remoteIp);
    return result.success;
  }

  async verifyDetailed(
    token: string,
    remoteIp?: string,
  ): Promise<TurnstileVerifyResult> {
    if (!this.secretKey) {
      this.logger.warn(
        'Turnstile secret key is not configured, skipping verification.',
      );
      return { success: true, errorCodes: [] };
    }

    if (this.secretKey.startsWith('1x0000000000000000000000000000000AA')) {
      this.logger.debug('Skipping Turnstile in dev environment');
      return { success: true, errorCodes: [] };
    }

    try {
      const formData = new URLSearchParams();
      formData.append('secret', this.secretKey);
      formData.append('response', token);
      // remoteip is optional; wrong proxy IPs cause false failures behind Vercel↔Render.
      if (this.shouldSendRemoteIp(remoteIp)) {
        formData.append('remoteip', remoteIp!.trim());
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
        return { success: true, errorCodes: [] };
      }

      const errorCodes = data['error-codes'] ?? [];
      this.logger.warn(
        `Turnstile verification failed: ${JSON.stringify(errorCodes)}`,
      );
      return { success: false, errorCodes };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error verifying Turnstile token: ${msg}`);
      return { success: false, errorCodes: ['internal-error'] };
    }
  }
}
