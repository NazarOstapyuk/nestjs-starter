import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

import { SMS_CODE_LENGTH } from '../../shared/constants/validation';

export class RegisterInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    type: String,
  })
  @Length(SMS_CODE_LENGTH, SMS_CODE_LENGTH)
  @IsString()
  @IsNotEmpty()
  smsCode: string;
}
