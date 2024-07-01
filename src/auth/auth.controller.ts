/* eslint-disable prettier/prettier */

// src/auth/auth.controller.ts
import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Res,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/users.service';
import { LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/User.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signup(@Body() SignUpDto: CreateUserDto, @Res() res) {
    const { email, password, username } = SignUpDto;
    const existingUser = await this.userService.findOne(email);

    if (existingUser) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: 'Email is already in use.',
      });
    }
    try {
      const user = await this.userService.create({
        email,
        password,
        username,
        status: 'pending',
      });
      return res.status(HttpStatus.CREATED).json({
        message: 'User created.',
        id: user._id,
      });
    } catch (error) {
      console.log(error, 'error');
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error has occurred.',
        error: error.message,
      });
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const { email } = loginDto;
    const existingUser = await this.userService.findOne(email);
    try {
      if (!existingUser) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Invalid Email',
        });
      }

      const result = await this.authService.login(existingUser);

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error has occurred.',
        error: error.message,
      });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh-token')
  @UsePipes(new ValidationPipe({ transform: true }))
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Res() res) {
    const { refreshToken, email } = refreshTokenDto;

    try {
      const newAccessToken = await this.authService.refreshAccessToken(
        refreshToken,
        email,
      );
      return res.status(HttpStatus.OK).json({ access_token: newAccessToken });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Unauthorized',
        error: error.message,
      });
    }
  }
}
