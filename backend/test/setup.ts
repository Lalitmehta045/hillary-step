// Test setup for staging integration gate
// Uses isolated hillary_staging_test database - no production data touched
process.env.PORT = '3001';
process.env.NODE_ENV = 'test';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.DATABASE_URL =
  'postgresql://postgres:Lalit_45@localhost:5432/hillary_staging_test?schema=public';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_S3_BUCKET_NAME = 'hillary-staging-test';
process.env.AWS_ACCESS_KEY_ID = 'test-access-key-id';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-access-key';
process.env.JWT_SECRET = 'test-jwt-secret-staging-gate-2024';
process.env.SESSION_SECRET = 'test-session-secret-staging-gate-2024';
process.env.COOKIE_DOMAIN = 'localhost';
process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY =
  '1x0000000000000000000000000000000AA';
process.env.CORS_ORIGIN = '*';
process.env.RATE_LIMIT_MAX = '1000';
process.env.RATE_LIMIT_WINDOW_MS = '60000';
