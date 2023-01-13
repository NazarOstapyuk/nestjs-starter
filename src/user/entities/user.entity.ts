import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../../permission/entities/Role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 100,
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({ length: 200, nullable: true, unique: true })
  email: string;

  @Column({ length: 200, nullable: true })
  fullName: string;

  @Exclude({ toPlainOnly: true })
  @Column({ length: 100 })
  password: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  roles: Role[];
}
