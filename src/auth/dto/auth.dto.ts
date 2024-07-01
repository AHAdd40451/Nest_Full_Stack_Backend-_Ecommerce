/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
export class ResetPasswordDto {
  @IsNotEmpty()
  token: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  newPassword: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsOptional()
  _id?: any;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  role?: string;
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

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}
