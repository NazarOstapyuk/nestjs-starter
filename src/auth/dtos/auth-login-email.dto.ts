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

export class LoginEmailInput {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
  })
  @MinLength(MIN_PASS_LENGTH)
  @MaxLength(MAX_PASS_LENGTH)
  @IsString()
  @IsNotEmpty()
  password: string;
}
