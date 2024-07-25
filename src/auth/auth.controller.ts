import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  CreateUserDto,
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "./dto/auth.dto";
import * as bcrypt from "bcrypt";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  @UsePipes(new ValidationPipe({ transform: true }))
  async signup(@Body() SignUpDto: CreateUserDto, @Res() res) {
    const { email, password, username } = SignUpDto;
    const existingUser = await this.authService.findOne(email);

    if (existingUser) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "Email is already in use.",
      });
    }
    try {
      const user = await this.authService.createUser({
        email,
        password,
        username,
        status: "pending",
      });
      return res.status(HttpStatus.CREATED).json({
        message: "User created.",
      });
    } catch (error) {
      console.log(error, "error");
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "An error has occurred.",
        error: error.message,
      });
    }
  }

  @Post("login")
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const { email, password } = loginDto;
    const existingUser = await this.authService.findOne(email);
    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Invalid credentials.",
      });
    }

    const result = await this.authService.login(existingUser);

    return res.status(HttpStatus.OK).json(result);
  }
  @Post("refresh-token")
  @UsePipes(new ValidationPipe({ transform: true }))
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Res() res) {
    const { refreshToken, email } = refreshTokenDto;

    try {
      const newAccessToken = await this.authService.generateToken(
        refreshToken,
        email,
        "12h"
      );
      return res.status(HttpStatus.OK).json({ access_token: newAccessToken });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Unauthorized",
        error: error.message,
      });
    }
  }
  
  @Post("forgot-password")
  @UsePipes(new ValidationPipe({ transform: true }))
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res() res
  ) {
    try {
      await this.authService.forgotPassword(forgotPasswordDto);
      return res.status(HttpStatus.OK).json({
        message:
          "Password reset email sent. Check your email for instructions.",
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Failed to initiate password reset process.",
        error: error.message,
      });
    }
  }

  @Post("reset-password")
  @UsePipes(new ValidationPipe({ transform: true }))
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() res) {
    try {
      const { email, token, newPassword } = resetPasswordDto;
      await this.authService.resetPassword(email, token, newPassword);
      return res.status(HttpStatus.OK).json({
        message: "Password reset Success",
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Failed to initiate password reset process.",
        error: error.message,
      });
    }
  }
}
