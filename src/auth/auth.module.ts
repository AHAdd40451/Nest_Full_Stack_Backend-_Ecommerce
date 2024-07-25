import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../prisma/prisma.service";
import { getEnv } from "src/utils/utils";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: getEnv("JWT_SECRET"),
      signOptions: { expiresIn: "12h" },
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
