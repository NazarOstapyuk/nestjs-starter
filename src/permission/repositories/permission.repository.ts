import { EntityRepository, Repository } from 'typeorm';

import { Role } from '../entities/Role.entity';
import { ERole } from '../../shared/permissions/RoleType.enum';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  async getRoleByName(name: ERole): Promise<Role> {
    return this.findOne({
      where: {
        name,
      },
    });
  }
}
