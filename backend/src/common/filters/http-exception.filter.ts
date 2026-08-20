import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { sanitizeForLog } from '../utils/sanitize.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const isProduction = process.env.NODE_ENV === 'production';

    // Log the error with sanitized inputs to prevent log injection
    const method = sanitizeForLog(request.method, 10);
    const url = sanitizeForLog(request.url, 500);
    const requestId = sanitizeForLog(request.headers['x-request-id'], 100);
    this.logger.error(
      `[${requestId || 'no-req-id'}] ${method} ${url}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    const errorResponse = {
      statusCode: status,
      message:
        typeof message === 'object' && message !== null && 'message' in message
          ? (message as Record<string, unknown>).message
          : message,
      error:
        typeof message === 'object' && message !== null && 'error' in message
          ? (message as Record<string, unknown>).error
          : exception instanceof HttpException
            ? exception.name
            : 'Internal Server Error',
      requestId: request.headers['x-request-id'],
      timestamp: new Date().toISOString(),
      ...(isProduction
        ? {}
        : { stack: exception instanceof Error ? exception.stack : null }),
    };

    // Fastify reply
    response.status(status).send(errorResponse);
  }
}
