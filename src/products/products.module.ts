import { Module } from "@nestjs/common";
import { AuthController } from "src/auth/auth.controller";
import { AuthService } from "src/auth/auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  imports: [],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
})
export class ProductsModule {}
