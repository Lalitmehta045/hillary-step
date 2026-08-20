import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class CloudflareIpMiddleware implements NestMiddleware {
  use(
    req: FastifyRequest['raw'] & { clientIp?: string },
    res: FastifyReply['raw'],
    next: () => void,
  ) {
    // Extract real client IP from CF-Connecting-IP header or fallback to other headers
    const cfIp = req.headers['cf-connecting-ip'] as string;
    const xForwardedFor = req.headers['x-forwarded-for'] as string;

    let clientIp = cfIp;

    if (!clientIp && xForwardedFor) {
      clientIp = xForwardedFor.split(',')[0].trim();
    }

    // Assign IP back to request (for fastify raw req or attach as header for interceptors)
    if (clientIp) {
      req.headers['x-client-ip'] = clientIp;
      req.clientIp = clientIp;
    }

    next();
  }
}
