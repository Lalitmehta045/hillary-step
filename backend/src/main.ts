import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// Fastify plugins
import helmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Initialize Fastify Adapter
  // We don't have configService yet, so we'll set trustProxy later, OR we can read process.env directly here
  // since NestFactory hasn't started.
  const trustedProxies = process.env.TRUSTED_PROXIES || '127.0.0.1, ::1';
  const adapter = new FastifyAdapter({
    logger: false, // We'll use our own logging interceptor
    trustProxy: trustedProxies, // Narrowly trust only explicit proxies (e.g. local Nginx)
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    { bufferLogs: true }, // Buffer logs until custom logger is set
  );

  const configService = app.get(ConfigService);

  // Read environment variables
  const port = configService.get<number>('app.port', 3000);
  const nodeEnv = configService.get<string>('app.nodeEnv', 'development');
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api/v1');
  const corsOrigin = configService.get<string>('security.corsOrigin');
  const rateLimitMax = configService.get<number>('security.rateLimitMax');
  const rateLimitWindowMs = configService.get<number>(
    'security.rateLimitWindowMs',
  );

  // Set global prefix
  app.setGlobalPrefix(apiPrefix);

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // Register fastify plugins on the underlying instance to avoid TypeScript incompatibility
  const fastifyInstance = app
    .getHttpAdapter()
    .getInstance() as import('fastify').FastifyInstance;

  await fastifyInstance.register(fastifyMultipart);
  await fastifyInstance.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc:
          nodeEnv === 'production'
            ? ["'self'", 'data:']
            : ["'self'", 'data:', 'validator.swagger.io'],
        scriptSrc: ["'self'", "https: 'unsafe-inline'"],
      },
    },
  });

  await fastifyInstance.register(fastifyCors, {
    origin: corsOrigin === '*' ? '*' : corsOrigin?.split(','),
    credentials: true,
  });

  await fastifyInstance.register(fastifyCookie, {
    secret: configService.get<string>('auth.sessionSecret', 'fallback-secret-key-at-least-32-chars-long'),
    parseOptions: {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'strict',
    },
  });

  await fastifyInstance.register(fastifyRateLimit, {
    max: rateLimitMax,
    timeWindow: rateLimitWindowMs,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Setup Swagger for development
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Hillary Step Solutions API')
      .setDescription('The core API backend for Hillary Step Solutions')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Start the application
  await app.listen(port, '0.0.0.0');

  logger.log(`Application is running on: ${await app.getUrl()}/${apiPrefix}`);
  if (nodeEnv !== 'production') {
    logger.log(`Swagger docs available at: ${await app.getUrl()}/api/docs`);
  }
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap', err);
  process.exit(1);
});
