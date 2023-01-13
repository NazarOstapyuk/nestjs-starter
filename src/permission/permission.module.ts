import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { RoleRepository } from './repositories/permission.repository';
import { PermissionService } from './services/permission.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([RoleRepository])],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
