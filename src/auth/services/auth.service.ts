import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { isPast } from 'date-fns';

import { ERRORS_MESSAGES } from '../../shared/constants/errors';
import { MIN_PASS_LENGTH } from '../../shared/constants/validation';
import { AppLogger } from '../../shared/logger/logger.service';
import { ERole } from '../../shared/permissions/RoleType.enum';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { User } from '../../user/entities/user.entity';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserService } from '../../user/services/user.service';
import { LoginEmailInput } from '../dtos/auth-login-email.dto';
import { LoginOutput } from '../dtos/auth-login-output.dto';
import { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto';
import { RegisterEmailInput } from '../dtos/auth-register-email.input.dto';
import { AuthResetNewPassword } from '../dtos/auth-reset-password-input.dto';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { JwtPayload } from '../types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshTokenRepository)
    private readonly repository: RefreshTokenRepository,
    private readonly logger: AppLogger,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  /**
   * Register user with email
   * @param ctx Request context
   * @param input Request register body
   */
  async registerWithEmail(
    ctx: RequestContext,
    input: RegisterEmailInput,
  ): Promise<User> {
    this.logger.log(ctx, `${this.registerWithEmail.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.getUserByEmail`);
    const user: User = await this.userService.getUserByEmail(input.email);

    if (user) {
      throw new NotFoundException(ERRORS_MESSAGES.USER_ALREADY_EXISTS);
    }

    const newUser = plainToClass(User, {
      password: input.password.trim(),
      fullName: input.fullName,
      email: input.email.toLocaleLowerCase().trim(),
    });

    if (newUser.password.length < MIN_PASS_LENGTH)
      throw new BadRequestException('error.incorrectPassword');

    this.logger.log(ctx, `calling ${UserRepository.name}.createUser`);
    return await this.userService.createUser(
      ctx,
      newUser,
      ERole.User,
    );
  }

  /**
   * User login
   * @param ctx Request context
   * @param email Request email param from dto
   * @param password Request password param from dto
   */
  async login(
    ctx: RequestContext,
    { email, password }: LoginEmailInput,
  ): Promise<User> {
    this.logger.log(ctx, `${this.login.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.getUserByEmail`);
    const user: User = await this.userService.getUserByEmail(
      email.toLocaleLowerCase(),
    );

    if (!user) {
      throw new NotFoundException(ERRORS_MESSAGES.WRONG_EMAIL);
    }

    this.logger.log(ctx, `calling ${compare.name}.comparePassword`);
    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new BadRequestException(ERRORS_MESSAGES.INCORRECT_CREDENTIALS);
    }

    delete user.password;

    return user;
  }

  /**
   * Create new tokens pair for user
   * @param ctx Request context
   * @param userId User id from params
   * @param input RefreshToken form body
   */
  async refreshToken(
    ctx: RequestContext,
    userId: string,
    input: RefreshTokenInput,
  ): Promise<LoginOutput> {
    this.logger.log(ctx, `${this.refreshToken.name} was called`);
    const user = await this.userService.getUserById(ctx, userId);

    if (!user) {
      throw new BadRequestException(ERRORS_MESSAGES.USER_NOT_FOUND);
    }

    const tokenInfo = await this.repository.getByRefresh(input.refreshToken);

    if (!tokenInfo || tokenInfo.user.id !== user.id) {
      throw new BadRequestException(ERRORS_MESSAGES.USER_NOT_FOUND);
    }

    await this.repository.delete({
      id: tokenInfo.id,
    });

    return this.generateJwt(ctx, user);
  }

  /**
   * Generate tokens after registration
   * @param ctx Request context
   * @param user User entity
   */
  async generateJwt(ctx: RequestContext, user: User): Promise<LoginOutput> {
    this.logger.log(ctx, `${this.generateJwt.name} was called`);

    const payload: JwtPayload = {
      id: user.id,
    };

    const tokens = {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '720d',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('REFRESH_SECRET'),
        expiresIn: '720d',
      }),
    };

    const refreshToken = plainToClass(RefreshToken, {
      ...tokens,
      user,
    });

    const result = await this.repository.save(refreshToken);

    delete result.user;

    return plainToClass(LoginOutput, result);
  }

  // async resetPassword(ctx, email: AuthResetPasswordInput): Promise<string> {
  //   const payload = { email };
  //   const resetToken = this.jwtService.sign(payload, {
  //     secret: this.configService.get<string>('JWT_SECRET'),
  //     expiresIn: '1h',
  //   });
  //
  //   const url = `https://${this.configService.get<string>(
  //     'APP_URL_STAGE',
  //   )}/api/v1/auth/reset-password/${resetToken}`;
  //
  //   const sendMail = await this.mailService.sendResetPass(
  //     ctx,
  //     url,
  //     email.email,
  //   );
  //
  //   return sendMail;
  // }

  async confirmResetPassword(
    ctx: RequestContext,
    input: AuthResetNewPassword,
    token: string,
  ): Promise<boolean> {
    this.logger.log(ctx, `calling ${JwtService.name}.decode`);
    const decodeToken = this.jwtService.decode(token);

    if (isPast(decodeToken['exp'] * 1000))
      throw new UnauthorizedException('tokenExpired');

    const user = await this.userService.getUserByEmail(decodeToken['email']);

    const newPassword = plainToClass(User, {
      ...user,
      password: input.newPassword,
    });

    const save = await this.userService.saveUser(ctx, newPassword);

    if (!save) throw new BadRequestException();

    return true;
  }
}
