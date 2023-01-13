import { NotFoundException } from '@nestjs/common';
import { EntityRepository, getRepository, Repository } from 'typeorm';

import { UserFinderQuery } from '../dtos/user-finder-query.dto';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getById(id: string): Promise<User | undefined> {
    const user = await this.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException();

    return user;
  }

  async getByPhone(phone: string): Promise<User> {
    const user = await this.findOne({
      where: {
        phone,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  async countByPhone(phone: string): Promise<number> {
    const userCount = await this.count({
      where: {
        phone,
      },
    });

    return userCount;
  }

  async findByQuery(query: UserFinderQuery): Promise<User[]> {
    const qb = await getRepository(User).createQueryBuilder('user');

    if (query.email) {
      await qb.where(`user.email like :email`, {
        email: `%${query.email}%`,
      });
    }

    if (query.fullName) {
      await qb.andWhere(`user.fullName like :fullName`, {
        fullName: `%${query.fullName}%`,
      });
    }
    return qb.getMany();
  }
}
