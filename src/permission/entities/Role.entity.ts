import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ERole } from '../../shared/permissions/RoleType.enum';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ERole,
    unique: true,
  })
  public name: ERole;

  @ManyToMany((type) => User, (user) => user.roles)
  public users: User[];
}
