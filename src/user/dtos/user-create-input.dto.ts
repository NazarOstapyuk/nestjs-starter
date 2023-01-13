import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class UserCreateInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('UA')
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  password: string;
}
