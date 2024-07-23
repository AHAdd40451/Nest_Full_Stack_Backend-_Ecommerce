/* eslint-disable prettier/prettier */
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { getEnv } from 'src/utils/utils';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/User.s/chema';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: getEnv('JWT_SECRET'),
      signOptions: { expiresIn: '12h' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService,  JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
