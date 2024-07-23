import { Module } from "@nestjs/common";
import { AuthController } from "src/auth/auth.controller";
import { AuthService } from "src/auth/auth.service";

@Module({
  imports: [],
  providers: [AuthService],
  controllers: [AuthController],
})
export class ProductsModule {}
