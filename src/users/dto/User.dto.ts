/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  displayName?: string;
}


export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  avatarUrl?: string;
}
