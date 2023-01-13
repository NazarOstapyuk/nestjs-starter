import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';


export class UserEmails {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;

  @Expose()
  @ApiProperty()
  email: string;
}

export class UserOutput {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  fullName: string;

  @Expose()
  @ApiProperty()
  phone: string;

  @Expose()
  @ApiProperty({ type: UserEmails, isArray: true })
  email: UserEmails[];

  @Expose()
  @ApiProperty()
  avatar: string;
}
