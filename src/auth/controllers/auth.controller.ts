import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetCurrentUserId } from '../../shared/decorators/get-current-user.decorator';
import { Public } from '../../shared/decorators/public.decorator';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorators';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { LoginEmailInput } from '../dtos/auth-login-email.dto';
import { LoginOutput } from '../dtos/auth-login-output.dto';
import { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto';
import { RegisterEmailInput } from '../dtos/auth-register-email.input.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'User login with email and password.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(LoginOutput),
  })
  @ApiBody({
    type: LoginEmailInput,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @ReqContext() ctx: RequestContext,
    @Body() input: LoginEmailInput,
  ): Promise<BaseApiResponse<LoginOutput>> {
    const user = await this.authService.login(ctx, input);
    const tokens = await this.authService.generateJwt(ctx, user);
    return {
      data: tokens,
      meta: {},
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(LoginOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async refresh(
    @ReqContext() ctx: RequestContext,
    @Body() input: RefreshTokenInput,
    @GetCurrentUserId() userId: string,
  ): Promise<BaseApiResponse<LoginOutput>> {
    const tokens = await this.authService.refreshToken(ctx, userId, input);

    return {
      data: tokens,
      meta: {},
    };
  }

  @Post('register/user/email')
  @ApiOperation({
    summary: 'User register with email.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(LoginOutput),
  })
  @ApiBody({
    type: RegisterEmailInput,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  async registerWithEmail(
    @ReqContext() ctx: RequestContext,
    @Body() input: RegisterEmailInput,
  ): Promise<BaseApiResponse<LoginOutput>> {
    const registeredUser = await this.authService.registerWithEmail(ctx, input);
    const data = await this.authService.generateJwt(ctx, registeredUser);

    return {
      data: data,
      meta: {},
    };
  }

  // @Post('reset-password')
  // @ApiOperation({
  //   summary: 'Send reset password email to user.',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: SwaggerBaseApiResponse('string'),
  // })
  // @ApiBody({
  //   type: AuthResetPasswordInput,
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   type: BaseApiErrorResponse,
  // })
  // @HttpCode(HttpStatus.OK)
  // @Public()
  // @UseInterceptors(ClassSerializerInterceptor)
  // async resetPassword(
  //   @ReqContext() ctx: RequestContext,
  //   @Body() email: AuthResetPasswordInput,
  // ): Promise<BaseApiResponse<string>> {
  //   const data = await this.authService.resetPassword(ctx, email);
  //
  //   return {
  //     data: data,
  //     meta: {},
  //   };
  // }
  //
  // @Post('reset-password/:token')
  // @ApiOperation({
  //   summary: 'Change password',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: SwaggerBaseApiResponse('boolean'),
  // })
  // @ApiBody({
  //   type: AuthResetNewPassword,
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   type: BaseApiErrorResponse,
  // })
  // @HttpCode(HttpStatus.OK)
  // @Public()
  // @UseInterceptors(ClassSerializerInterceptor)
  // async confirmResetPassword(
  //   @ReqContext() ctx: RequestContext,
  //   @Body() input: AuthResetNewPassword,
  //   @Param('token') token: string,
  // ): Promise<BaseApiResponse<boolean>> {
  //   const data = await this.authService.confirmResetPassword(ctx, input, token);
  //
  //   return {
  //     data: data,
  //     meta: {},
  //   };
  // }
}
