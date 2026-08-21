import type { CookieSerializeOptions } from '@fastify/cookie';

const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60; // 24 hours

/**
 * Session cookie options for cross-origin SPA → API auth.
 *
 * Production (Vercel frontend + Render backend) is cross-site, so the browser
 * only sends cookies on credentialed requests when SameSite=None and Secure.
 * Localhost is same-site over HTTP, so Lax without Secure is used there.
 *
 * Domain is intentionally omitted (host-only) — Vercel and Render share no
 * common parent domain, so COOKIE_DOMAIN cannot bridge them.
 */
export function getSessionCookieOptions(): CookieSerializeOptions {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    path: '/',
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/** Matching options for clearCookie (must align with setCookie attrs). */
export function getClearSessionCookieOptions(): CookieSerializeOptions {
  const { maxAge: _maxAge, ...options } = getSessionCookieOptions();
  void _maxAge;
  return options;
}
