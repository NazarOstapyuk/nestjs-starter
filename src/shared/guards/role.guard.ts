import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserService } from '../../user/services/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesRequired = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!rolesRequired) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userRole = await this.getUserRole(context, user.id);

    return userRole.roles.some((role) => rolesRequired.includes(role.name));
  }

  async getUserRole(ctx, userId: string) {
    return await this.userService.getUserById(null, userId);
  }
}
