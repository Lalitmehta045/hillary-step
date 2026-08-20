import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from '../../auth/session.service';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = request.cookies['hs_session'];

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    const session = await this.sessionService.validateSession(token);
    if (!session) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    // Attach admin to request object for later use
    (request as FastifyRequest & { admin?: unknown }).admin = session.admin;

    return true;
  }
}
