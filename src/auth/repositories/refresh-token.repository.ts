import { EntityRepository, Repository } from 'typeorm';

import { RefreshToken } from '../entities/refresh-token.entity';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
  async getTokenByUserId(id: string): Promise<RefreshToken | undefined> {
    return this.findOne({
      where: {
        user: {
          id,
        },
      },
    });
  }

  async getByRefresh(refreshToken: string): Promise<RefreshToken | undefined> {
    return this.findOne({
      where: {
        refreshToken,
      },
      relations: ['user'],
    });
  }
}
