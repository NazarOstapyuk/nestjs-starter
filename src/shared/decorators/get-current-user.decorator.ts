import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayload } from '../../auth/types/jwt-payload.interface';

export const GetCurrentUserId = createParamDecorator(
  (data: keyof JwtPayload = 'id', context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user.id;
  },
);
