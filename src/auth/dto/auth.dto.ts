/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
export class TokenDto {
  @IsNotEmpty()
  _id?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
