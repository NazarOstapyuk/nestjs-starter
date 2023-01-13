import { IsOptional, IsString } from 'class-validator';

export class UserFinderQuery {
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  fullName: string;
}
