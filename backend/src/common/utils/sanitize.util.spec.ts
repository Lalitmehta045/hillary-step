import { sanitizeForLog, stripHtmlTags } from './sanitize.util';

describe('Sanitize Utility', () => {
  describe('sanitizeForLog', () => {
    it('should pass through normal strings', () => {
      expect(sanitizeForLog('hello world')).toBe('hello world');
    });

    it('should strip newlines (CRLF injection prevention)', () => {
      const malicious = 'hello\nworld\r\nFAKE LOG ENTRY';
      const result = sanitizeForLog(malicious);
      expect(result).not.toContain('\n');
      expect(result).not.toContain('\r');
    });

    it('should strip tab characters', () => {
      expect(sanitizeForLog('a\tb')).toBe('a b');
    });

    it('should strip control characters', () => {
      const withControl = 'hello\x00\x01\x02world';
      expect(sanitizeForLog(withControl)).toBe('helloworld');
    });

    it('should truncate to max length', () => {
      const long = 'a'.repeat(1000);
      expect(sanitizeForLog(long, 100).length).toBe(100);
    });

    it('should handle null and undefined', () => {
      expect(sanitizeForLog(null)).toBe('');
      expect(sanitizeForLog(undefined)).toBe('');
    });

    it('should convert non-strings to string', () => {
      expect(sanitizeForLog(123)).toBe('123');
    });
  });

  describe('stripHtmlTags', () => {
    it('should strip HTML tags', () => {
      expect(stripHtmlTags('<script>alert(1)</script>')).toBe('alert(1)');
    });

    it('should handle empty input', () => {
      expect(stripHtmlTags('')).toBe('');
    });
  });
});
