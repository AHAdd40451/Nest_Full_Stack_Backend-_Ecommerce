/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, TokenDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/User.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user && (await user.validPassword(password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async generateAccessToken(user: TokenDto) {
    const payload = { email: user.email, userId: user._id };
    return this.jwtService.sign(payload, { expiresIn: '12h' });
  }
  async generateRefreshToken(user: TokenDto) {
    const payload = { email: user.email, userId: user._id };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  async refreshAccessToken(
    refreshToken: string,
    email?: string,
  ): Promise<string> {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.userService.findOne(decoded.email);

      if ((email && decoded.email !== email) || !user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const payload = { email: user.email, userId: user._id };
      return await this.generateAccessToken(payload);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async login(user: CreateUserDto) {
    const payload = { email: user.email, userId: user._id };

    return {
      access_token: await this.generateAccessToken(payload),
      refresh_token: await this.generateRefreshToken(payload),
    };
  }
}
