import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Admin } from '@prisma/client';

export const CurrentAdmin = createParamDecorator(
  (data: keyof Admin | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<import('fastify').FastifyRequest & { admin?: Admin }>();
    const admin = request.admin;

    if (!admin) {
      return null;
    }

    return data ? admin[data] : admin;
  },
);
