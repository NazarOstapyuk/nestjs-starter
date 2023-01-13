import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { MainEntity } from '../../shared/entities/Main.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class RefreshToken extends MainEntity {
  @Column()
  refreshToken: string;

  @Column()
  accessToken: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
