/**
 * Strips HTML tags from a given string.
 * @param input - The string to sanitize
 * @returns The sanitized string without HTML tags
 */
export function stripHtmlTags(input: string): string {
  if (!input) return input;
  return input.replace(/<[^>]*>?/gm, '');
}

/**
 * Sanitizes a string for safe inclusion in log messages.
 * Strips control characters, newlines, carriage returns, and other
 * characters that could enable log injection attacks (CRLF injection).
 * @param input - The string to sanitize
 * @param maxLength - Maximum allowed length (default 500)
 * @returns The sanitized string safe for logging
 */
export function sanitizeForLog(input: unknown, maxLength = 500): string {
  if (input === null || input === undefined) return '';
  const str =
    typeof input === 'string'
      ? input
      : typeof input === 'number' || typeof input === 'boolean'
        ? String(input)
        : '';

  return (
    str
      .replace(/[\r\n\t]/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1f\x7f]/g, '')
      .slice(0, maxLength)
  );
}

/**
 * Recursively sanitizes all string fields within an object, stripping HTML tags.
 * @param obj - The object to sanitize
 * @returns A new object with sanitized string fields
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return stripHtmlTags(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item: unknown) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const sanitizedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitizedObj[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitizedObj;
  }

  return obj;
}
