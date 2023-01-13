import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PermissionService } from '../../permission/services/permission.service';
import { AppLogger } from '../../shared/logger/logger.service';
import { ERole } from '../../shared/permissions/RoleType.enum';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserFinderQuery } from '../dtos/user-finder-query.dto';
import { UserUpdateInput } from '../dtos/user-update-input.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { Role } from '../../permission/entities/Role.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: AppLogger,
    @InjectRepository(UserRepository)
    private readonly repository: UserRepository,
    private readonly permissionService: PermissionService,
  ) {
    this.logger.setContext(UserService.name);
  }

  async getCountByPhone(ctx: RequestContext, phone: string): Promise<number> {
    this.logger.log(ctx, `${this.getCountByPhone.name} was called`);

    this.logger.log(ctx, `${UserRepository.name}.countByPhone`);
    return await this.repository.countByPhone(phone);
  }

  async createUser(
    ctx: RequestContext,
    user: User,
    role = ERole.User,
  ): Promise<User> {
    this.logger.log(ctx, `${this.createUser.name} was called`);

    const newUserRole = await this.preloadRolesByName(role);

    if (!newUserRole) {
      throw new BadRequestException('error.cantAssignRole');
    }

    user.roles = [newUserRole];

    this.logger.log(ctx, `calling ${UserRepository.name}.saveUser`);
    await this.repository.save(user);

    return user;
  }

  private preloadRolesByName(name: ERole): Promise<Role> {
    return this.permissionService.getRoleByName(name);
  }

  async updateUser(
    ctx: RequestContext,
    id: string,
    input: UserUpdateInput,
  ): Promise<User> {
    this.logger.log(ctx, `${this.updateUser.name} was called`);

    this.logger.log(ctx, `${UserRepository.name}.getById`);
    const user = await this.repository.getById(id);
    if (!user) throw new NotFoundException();

    const updatedUser = plainToClass(User, {
      ...user,
      ...input,
      phone: input.phone ?? null,
      password: input.password,
    });

    this.logger.log(ctx, `calling ${UserRepository.name}.saveUser`);
    return await this.repository.save(updatedUser);
  }

  async getUserById(
    ctx: RequestContext,
    id: string,
  ): Promise<User | undefined> {
    this.logger.log(ctx, `${this.getUserById.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.getById`);
    const user = await this.repository.getById(id);

    return plainToClass(User, {
      ...user,
    });
  }

  async saveUser(ctx: RequestContext, user: User): Promise<User | undefined> {
    this.logger.log(ctx, `${this.saveUser.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.save`);
    return this.repository.save(user);
  }

  async getById(id: string): Promise<User | undefined> {
    return await this.repository.getById(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return this.repository.getByPhone(phone);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.repository.getByEmail(email);
  }

  async getAllUsers(
    ctx: RequestContext,
    query: UserFinderQuery,
  ): Promise<User[]> {
    this.logger.log(ctx, `${this.getAllUsers.name} was called`);

    this.logger.log(ctx, `${UserRepository.name}.findByQuery`);
    return this.repository.findByQuery(query);
  }

  async updateAccountStatus(
    ctx: RequestContext,
    userId: string,
  ): Promise<User> {
    this.logger.log(ctx, `${this.updateUser.name} was called`);

    this.logger.log(ctx, `${UserRepository.name}.getById`);
    const user = await this.repository.getById(userId);
    if (!user) throw new NotFoundException();

    return await this.saveUser(ctx, user);
  }

  async deleteUser(ctx: RequestContext, userId: string): Promise<User> {
    this.logger.log(ctx, `${this.deleteUser.name} was called`);

    this.logger.log(ctx, `${UserRepository.name}.getById`);
    const user = await this.repository.getById(userId);

    this.logger.log(ctx, `${UserRepository.name}.remove`);
    return await this.repository.remove(user);
  }
}
