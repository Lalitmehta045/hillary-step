import { Injectable, Logger } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

@Injectable()
export class MfaService {
  private readonly logger = new Logger(MfaService.name);
  private readonly encryptionKey: Buffer;

  constructor() {
    // We use the application's JWT secret as the base for our encryption key
    // Hashing it ensures it's exactly 32 bytes (256 bits) for AES-256-GCM.
    const baseSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';
    this.encryptionKey = crypto
      .createHash('sha256')
      .update(String(baseSecret))
      .digest();

    // Set standard authenticator options
    authenticator.options = { window: 1 };
  }

  public generateSecret(): string {
    return authenticator.generateSecret();
  }

  public async generateQrCodeDataUrl(
    email: string,
    secret: string,
  ): Promise<string> {
    const uri = authenticator.keyuri(email, 'Hillary Step Admin', secret);
    return qrcode.toDataURL(uri);
  }

  public verifyCode(token: string, secret: string): boolean {
    try {
      return authenticator.verify({ token, secret });
    } catch (err: unknown) {
      this.logger.error(
        `Error verifying TOTP code: ${err instanceof Error ? err.message : String(err)}`,
      );
      return false;
    }
  }

  public encryptSecret(plaintext: string): string {
    const iv = crypto.randomBytes(12); // GCM standard IV length
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encryptedText
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  public decryptSecret(ciphertext: string): string {
    try {
      const parts = ciphertext.split(':');
      if (parts.length !== 3)
        throw new Error('Invalid encrypted secret format');

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = Buffer.from(parts[2], 'hex');

      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        this.encryptionKey,
        iv,
      );
      decipher.setAuthTag(authTag);

      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);
      return decrypted.toString('utf8');
    } catch (err: unknown) {
      this.logger.error(
        `Error decrypting MFA secret: ${err instanceof Error ? err.message : String(err)}`,
      );
      throw new Error('Failed to decrypt MFA secret');
    }
  }

  public async generateRecoveryCodes(
    count = 10,
  ): Promise<{ plainCodes: string[]; hashedCodes: string[] }> {
    const plainCodes: string[] = [];
    const hashedCodes: string[] = [];

    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(6).toString('hex').toUpperCase();
      const formatted = `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8)}`;
      plainCodes.push(formatted);

      const hashed = await argon2.hash(formatted);
      hashedCodes.push(hashed);
    }

    return { plainCodes, hashedCodes };
  }

  public async verifyAndConsumeRecoveryCode(
    providedCode: string,
    storedHashedCodes: string[],
  ): Promise<{ valid: boolean; updatedCodes: string[] }> {
    for (let i = 0; i < storedHashedCodes.length; i++) {
      const isMatch = await argon2.verify(storedHashedCodes[i], providedCode);
      if (isMatch) {
        // Remove the used code
        const updatedCodes = [...storedHashedCodes];
        updatedCodes.splice(i, 1);
        return { valid: true, updatedCodes };
      }
    }
    return { valid: false, updatedCodes: storedHashedCodes };
  }
}
