/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { IAuthPayLoadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

const users = [
  {
    username: 'ahad',
    email: 'ahad@ahad.com',
    password: 'ahad',
  },
  {
    username: 'khan',
    email: 'khan@khan.com',
    password: 'khan',
  },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateUser({ username, password }: IAuthPayLoadDto) {
    const findUser = users.find((user) => user.username === username);

    if (!findUser) {
      return null;
    }

    if (password === findUser.password) {
      const { password, ...user } = findUser;
      return this.jwtService.sign(user);
    }
  }
}
