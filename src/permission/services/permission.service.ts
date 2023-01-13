import { Injectable } from '@nestjs/common';
import { Role } from '../entities/Role.entity';
import { RoleRepository } from '../repositories/permission.repository';
import { ERole } from '../../shared/permissions/RoleType.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly repository: RoleRepository,
  ) {}

  async getRoleByName(name: ERole): Promise<Role> {
    return this.repository.getRoleByName(name);
  }
}
