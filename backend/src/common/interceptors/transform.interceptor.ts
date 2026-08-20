import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';

export interface Response<T> {
  success: boolean;
  data: T;
  timestamp: string;
  requestId: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const requestId = (request.headers['x-request-id'] as string) || '';

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        requestId,
      })),
    );
  }
}
