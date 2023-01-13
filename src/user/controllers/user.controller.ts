import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetCurrentUserId } from '../../shared/decorators/get-current-user.decorator';
import { Permission } from '../../shared/decorators/role.decorator';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { ERole } from '../../shared/permissions/RoleType.enum';
import { ReqContext } from '../../shared/request-context/req-context.decorators';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserFinderQuery } from '../dtos/user-finder-query.dto';
import { UserOutput } from '../dtos/user-output.dto';
import { UserUpdateInput } from '../dtos/user-update-input.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Permission(ERole.User, ERole.Admin)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Get user information.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getMyself(
    @ReqContext() ctx: RequestContext,
    @GetCurrentUserId() id: string,
  ) {
    const data = await this.userService.getUserById(ctx, id);

    return {
      data: data,
      meta: {},
    };
  }

  // @Post('/support')
  // @Permission(ERole.User, ERole.Admin)
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({
  //   summary: 'Send email to support.',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: SwaggerBaseApiResponse(UserOutput),
  //   description:
  //     '"id": "<20220720080247.f2f6a85e7bb51ca5@sandbox8ff1ded91b0a486baf6db84705833f7f.mailgun.org>",\n' +
  //     '"message": "Queued. Thank you."',
  // })
  // @ApiBody({
  //   type: UserSendMailInput,
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   type: BaseApiErrorResponse,
  // })
  // @HttpCode(HttpStatus.OK)
  // @UseInterceptors(ClassSerializerInterceptor)
  // async sendSupport(
  //   @ReqContext() ctx: RequestContext,
  //   @GetCurrentUserId() id: string,
  //   @Body('message') message: string,
  // ) {
  //   const data = await this.userService.sendSupportMail(ctx, id, message);
  //
  //   return {
  //     data: data,
  //     meta: {},
  //   };
  // }

  @Permission(ERole.User, ERole.Admin)
  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiOperation({
    summary: 'Update user profile.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateUser(
    @ReqContext() ctx: RequestContext,
    @GetCurrentUserId() userId: string,
    @Body() input: UserUpdateInput,
  ): Promise<BaseApiResponse<User>> {
    const data = await this.userService.updateUser(ctx, userId, input);

    return {
      data: data,
      meta: {},
    };
  }

  @Permission(ERole.Admin, ERole.User)
  @UseGuards(JwtAuthGuard)
  @Get('all')
  @ApiOperation({
    summary: 'Get all user what we have, query is optional.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([UserOutput]),
  })
  @ApiQuery({
    type: UserFinderQuery,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllUsers(
    @ReqContext() ctx: RequestContext,
    @Query() query: UserFinderQuery,
  ): Promise<BaseApiResponse<User[]>> {
    const users = await this.userService.getAllUsers(ctx, query);

    return {
      data: users,
      meta: {},
    };
  }

  @Permission(ERole.Admin, ERole.User)
  @UseGuards(JwtAuthGuard)
  @Put('/status')
  @ApiOperation({
    summary: 'Update user account status.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateAccountStatus(
    @ReqContext() ctx: RequestContext,
    @GetCurrentUserId() userId: string,
  ): Promise<BaseApiResponse<User>> {
    const data = await this.userService.updateAccountStatus(ctx, userId);

    return {
      data: data,
      meta: {},
    };
  }

  @Permission(ERole.Admin, ERole.User)
  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  @ApiOperation({
    summary: 'Delete user.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteUser(
    @ReqContext() ctx: RequestContext,
    @GetCurrentUserId() userId: string,
  ): Promise<BaseApiResponse<User>> {
    const data = await this.userService.deleteUser(ctx, userId);

    return {
      data: data,
      meta: {},
    };
  }
}
