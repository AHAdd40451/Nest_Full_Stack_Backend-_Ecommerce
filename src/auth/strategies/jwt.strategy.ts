/* eslint-disable prettier/prettier */

// src/auth/strategies/jwt.strategy.ts
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { getEnv } from 'src/utils/utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getEnv('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      return { email: payload.email };
    } catch (error) {
      throw new UnauthorizedException('Unauthorized', error.message);
    }
  }
}
