/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto, LoginDto, TokenDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/User.s/chema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findOne(email);
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
  async generateResetToken(email: string) {
    const payload = { email };
    return this.jwtService.sign(payload, { expiresIn: '5m' });
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
      const user = await this.findOne(decoded.email);

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

  async findOne(email: string): Promise<User> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async create(user: CreateUserDto): Promise<CreateUserDto> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).select('+password').exec();
  }

  async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async updatePassword(userId: any, newPassword: string): Promise<User | null> {
    const enc = await this.encryptPassword(newPassword);
    return this.userModel
      .findByIdAndUpdate(userId, { password: enc }, { new: true })
      .exec();
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;
    const user = await this.findOne(email);

    if (!user) {
      throw new Error('User not found.');
    }

    try {
      const resetToken = await this.generateResetToken(email);
      console.log(
        `Sending password reset email to ${email} with token: ${resetToken}`,
      );
    } catch (error) {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<any> {
    const user = await this.findOne(email);

    if (!user) {
      throw new Error('User not found.');
    }
    const isValidToken = await this.jwtService.verify(token);

    if (isValidToken.email !== email) {
      throw new Error('Invalid or expired token.');
    }

    try {
      const result = await this.updatePassword(user._id, newPassword);
      return result;
    } catch (error) {
      return error;
    }
  }
}
