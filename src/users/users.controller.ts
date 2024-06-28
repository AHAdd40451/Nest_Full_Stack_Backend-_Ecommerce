/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/User.dto';
import { isValidObjectId } from 'src/utils/utils';
import mongoose from 'mongoose';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto, 'createUserDto');
    return this.userService.createUser(createUserDto);
  }

  @Get()
  getUsers() {
    return this.userService.getUser();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    if (!isValidObjectId(id)) return new HttpException('Invalid Id', 400);
    const userFind = this.userService.getUserById(id);
    if (!userFind) return new HttpException('Error No User Found', 404);
  }

  

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!isValidObjectId(id)) throw new HttpException('Invalid Id', 400);
    const updatedUser = await this.userService.updateduser(id, updateUserDto);
    if (!updatedUser) throw new HttpException('User Not Found', 404);
    return updatedUser;
  }
}
