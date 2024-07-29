import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaClient, User } from "@prisma/client";
import { GenericService } from "src/Generic/generic.service";
import { CreateUserDto } from "./dto/auth.dto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  private readonly userService: GenericService<User>;
  private prismaService: PrismaService;

  constructor(private jwtService: JwtService) {
    this.userService = new GenericService<User>(this.prismaService, "user");
  }

  async findOne(email: string): Promise<User | null> {
    return this.userService.findOne({ email });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async validateUser(email: string): Promise<User> {
    return this.findOne(email);
  }

  async login(user: User): Promise<any> {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: "12h" }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: "7d" }),
    };
  }

  async generateToken(
    refreshToken: string,
    email: string,
    expiresIn: string
  ): Promise<string> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.findOne(email);

      if (!user || user.id !== decoded.sub) {
        throw new UnauthorizedException();
      }

      const payload = { email: user.email, sub: user.id };
      return this.jwtService.sign(payload, { expiresIn });
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async forgotPassword(forgotPasswordDto: any): Promise<void> {
    // Your forgot password logic here
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<void> {
    ``;
    // Your reset password logic here
  }
}
