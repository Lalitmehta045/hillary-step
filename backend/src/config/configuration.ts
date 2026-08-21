export default () => ({
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL,
    apiPrefix: process.env.API_PREFIX || 'api/v1',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  aws: {
    region: process.env.AWS_REGION,
    s3BucketName: process.env.AWS_S3_BUCKET_NAME,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    mockMode: process.env.AWS_S3_MOCK_MODE === 'true',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    cookieDomain: process.env.COOKIE_DOMAIN,
  },
  cloudflare: {
    turnstileSecretKey: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
  },
  security: {
    corsOrigin: process.env.CORS_ORIGIN || '*',
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    rateLimitWindowMs: parseInt(
      process.env.RATE_LIMIT_WINDOW_MS || '60000',
      10,
    ),
  },
  email: {
    resendApiKey: process.env.RESEND_API_KEY,
    adminNotificationEmail:
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      'info@hillarystepsolutions.com',
    from:
      process.env.EMAIL_FROM || 'Hillary Step <onboarding@resend.dev>',
  },
});
