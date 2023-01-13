import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  MAX_PASS_LENGTH,
  MIN_PASS_LENGTH,
  SMS_CODE_LENGTH,
} from '../../shared/constants/validation';

export class RegisterEmailInput {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    type: String,
  })
  @Length(SMS_CODE_LENGTH, SMS_CODE_LENGTH)
  @IsNotEmpty()
  smsCode: string;
}
