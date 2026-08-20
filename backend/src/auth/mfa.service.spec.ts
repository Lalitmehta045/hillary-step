import { Test, TestingModule } from '@nestjs/testing';
import { MfaService } from './mfa.service';
import { authenticator } from 'otplib';

describe('MfaService', () => {
  let service: MfaService;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret-key-for-mfa';
    const module: TestingModule = await Test.createTestingModule({
      providers: [MfaService],
    }).compile();

    service = module.get<MfaService>(MfaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Secret encryption', () => {
    it('should encrypt and decrypt a secret correctly', () => {
      const plaintext = 'JBSWY3DPEHPK3PXP';
      const encrypted = service.encryptSecret(plaintext);
      const decrypted = service.decryptSecret(encrypted);

      expect(decrypted).toBe(plaintext);
      expect(encrypted).not.toBe(plaintext);
    });

    it('should produce different ciphertexts for the same plaintext (random IV)', () => {
      const plaintext = 'JBSWY3DPEHPK3PXP';
      const encrypted1 = service.encryptSecret(plaintext);
      const encrypted2 = service.encryptSecret(plaintext);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should reject tampered ciphertext', () => {
      const plaintext = 'JBSWY3DPEHPK3PXP';
      const encrypted = service.encryptSecret(plaintext);
      const parts = encrypted.split(':');
      const tampered = parts[0] + ':' + parts[1] + ':' + '00'.repeat(20);
      expect(() => service.decryptSecret(tampered)).toThrow();
    });

    it('should reject malformed ciphertext', () => {
      expect(() => service.decryptSecret('not-valid')).toThrow();
      expect(() => service.decryptSecret('a:b:c:d')).toThrow();
    });
  });

  describe('TOTP code generation and verification', () => {
    it('should generate a secret', () => {
      const secret = service.generateSecret();
      expect(secret).toBeDefined();
      expect(secret.length).toBeGreaterThan(0);
    });

    it('should verify a valid TOTP code', () => {
      const secret = service.generateSecret();
      const token = authenticator.generate(secret);
      expect(service.verifyCode(token, secret)).toBe(true);
    });

    it('should reject an invalid TOTP code', () => {
      const secret = service.generateSecret();
      expect(service.verifyCode('000000', secret)).toBe(false);
    });
  });

  describe('Recovery codes', () => {
    it('should generate the requested number of recovery codes', async () => {
      const { plainCodes, hashedCodes } =
        await service.generateRecoveryCodes(10);
      expect(plainCodes.length).toBe(10);
      expect(hashedCodes.length).toBe(10);
    });

    it('should generate unique codes', async () => {
      const { plainCodes } = await service.generateRecoveryCodes(10);
      const unique = new Set(plainCodes);
      expect(unique.size).toBe(10);
    });

    it('should verify and consume a valid recovery code', async () => {
      const { plainCodes, hashedCodes } =
        await service.generateRecoveryCodes(10);
      const result = await service.verifyAndConsumeRecoveryCode(
        plainCodes[0],
        hashedCodes,
      );
      expect(result.valid).toBe(true);
      expect(result.updatedCodes.length).toBe(9);
    });

    it('should reject an invalid recovery code', async () => {
      const { hashedCodes } = await service.generateRecoveryCodes(10);
      const result = await service.verifyAndConsumeRecoveryCode(
        'INVALID-CODE-1234',
        hashedCodes,
      );
      expect(result.valid).toBe(false);
      expect(result.updatedCodes.length).toBe(10);
    });

    it('should not reuse a consumed recovery code', async () => {
      const { plainCodes, hashedCodes } =
        await service.generateRecoveryCodes(10);
      const result = await service.verifyAndConsumeRecoveryCode(
        plainCodes[0],
        hashedCodes,
      );
      expect(result.valid).toBe(true);
      const result2 = await service.verifyAndConsumeRecoveryCode(
        plainCodes[0],
        result.updatedCodes,
      );
      expect(result2.valid).toBe(false);
    });
  });

  describe('QR code generation', () => {
    it('should generate a QR code data URL', async () => {
      const secret = service.generateSecret();
      const qrCode = await service.generateQrCodeDataUrl(
        'admin@test.com',
        secret,
      );
      expect(qrCode).toMatch(/^data:image\/png;base64,/);
    });
  });
});
