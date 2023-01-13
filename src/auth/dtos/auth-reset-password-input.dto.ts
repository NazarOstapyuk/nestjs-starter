import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  MAX_PASS_LENGTH,
  MIN_PASS_LENGTH,
} from '../../shared/constants/validation';

export class AuthResetPasswordInput {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class AuthResetNewPassword {
  @ApiProperty({
    type: String,
  })
  @MinLength(MIN_PASS_LENGTH)
  @MaxLength(MAX_PASS_LENGTH)
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
