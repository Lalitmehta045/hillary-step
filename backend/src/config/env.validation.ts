import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // App
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  FRONTEND_URL: Joi.string().uri().required(),
  API_PREFIX: Joi.string().default('api/v1'),
  TRUSTED_PROXIES: Joi.string().default('127.0.0.1, ::1'),

  // Database
  DATABASE_URL: Joi.string().required(),

  // AWS
  AWS_REGION: Joi.string().required(),
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),

  // Auth
  JWT_SECRET: Joi.string().required(),
  SESSION_SECRET: Joi.string().required(),
  COOKIE_DOMAIN: Joi.string().required(),

  // Cloudflare
  CLOUDFLARE_TURNSTILE_SECRET_KEY: Joi.string().required(),

  // Security
  CORS_ORIGIN: Joi.string().required(),
  RATE_LIMIT_MAX: Joi.number().default(100),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(60000),

  // Transactional email (Resend) — optional so app boots; enquiry save still works without it
  RESEND_API_KEY: Joi.string().allow('').optional(),
  ADMIN_NOTIFICATION_EMAIL: Joi.string()
    .email()
    .default('info@hillarystepsolutions.com'),
  EMAIL_FROM: Joi.string()
    .allow('')
    .optional()
    .default('Hillary Step <onboarding@resend.dev>'),
});
