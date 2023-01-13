import { ApiProperty } from '@nestjs/swagger';

export class LoginOutput {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
