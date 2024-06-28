/* eslint-disable prettier/prettier */
import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { IAuthPayLoadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() authPayload: IAuthPayLoadDto) {
    const user = this.authService.validateUser(authPayload);

    if (!user) {
      throw new HttpException('Invalid Credentials', 401);
    }

    return user
  }
}
