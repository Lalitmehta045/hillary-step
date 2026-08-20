import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FastifyRequest, FastifyReply } from 'fastify';
import { sanitizeForLog } from '../utils/sanitize.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

    const method = sanitizeForLog(request.method, 10);
    const url = sanitizeForLog(request.url, 500);
    const userAgent = sanitizeForLog(request.headers['user-agent'], 200);
    const clientIp = sanitizeForLog(
      request.headers['x-client-ip'] || request.ip,
      45,
    );
    const requestId = sanitizeForLog(request.headers['x-request-id'], 100);

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode;
        const duration = Date.now() - now;
        this.logger.log(
          `[${requestId}] ${method} ${url} ${statusCode} - ${userAgent} ${clientIp} - ${duration}ms`,
        );
      }),
    );
  }
}
