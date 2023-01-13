import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { Role } from '../permission/entities/Role.entity';
import { ERole } from '../shared/permissions/RoleType.enum';

export default class RoleSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    let roles: ERole[] = [ERole.User, ERole.Admin];

    const createdRoles = await connection
      .createQueryBuilder(Role, 'role')
      .getMany()
      .then((roles) => roles.map((r) => r.name));

    roles = roles.filter((r) => !createdRoles.includes(r));

    if (roles.length) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(Role)
        .values(roles.map((r) => ({ name: r })))
        .execute();
    }
  }
}
