import { SetMetadata } from '@nestjs/common';

import { ERole } from '../permissions/RoleType.enum';

export const ROLES_KEY = 'roles';
export const Permission = (...roles: ERole[]) => SetMetadata(ROLES_KEY, roles);
