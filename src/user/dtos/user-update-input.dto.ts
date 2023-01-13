import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  MAX_FULL_NAME_LENGTH,
  MAX_PASS_LENGTH,
  MIN_FULL_NAME_LENGTH,
  MIN_PASS_LENGTH,
} from '../../shared/constants/validation';

export class UserUpdateInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  // @IsPhoneNumber()
  phone?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiProperty({
    minLength: MIN_FULL_NAME_LENGTH,
    maxLength: MAX_FULL_NAME_LENGTH,
  })
  @IsString()
  @IsOptional()
  @MinLength(MIN_FULL_NAME_LENGTH)
  @MaxLength(MAX_FULL_NAME_LENGTH)
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    minLength: MIN_PASS_LENGTH,
    maxLength: MAX_PASS_LENGTH,
  })
  @IsString()
  @IsOptional()
  @MinLength(MIN_PASS_LENGTH)
  @MaxLength(MAX_PASS_LENGTH)
  password: string;
}
