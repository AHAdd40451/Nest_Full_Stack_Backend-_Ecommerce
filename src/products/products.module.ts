import { Module } from "@nestjs/common";
import { AuthController } from "src/auth/auth.controller";
import { AuthService } from "src/auth/auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Category } from "src/schemas/Category.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: Category }]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class ProductsModule {}
