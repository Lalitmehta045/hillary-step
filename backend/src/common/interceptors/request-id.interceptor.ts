import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

    // Generate or extract request ID
    const requestId = (request.headers['x-request-id'] as string) || uuidv4();
    request.headers['x-request-id'] = requestId;

    // Fastify reply headers must be set using the reply object
    // For interceptors, we can tap into the response observable
    return next.handle().pipe(
      tap(() => {
        response.header('x-request-id', requestId);
      }),
    );
  }
}
