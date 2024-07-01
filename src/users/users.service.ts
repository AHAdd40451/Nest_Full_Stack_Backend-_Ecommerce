/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User } from 'src/schemas/User.Schema';
// import { CreateUserDto, UpdateUserDto } from './dto/User.dto';

// @Injectable()
// export class UserService {
//   constructor(@InjectModel(User.name) private userModel: Model<User>) {}

//   createUser(createUserDto: CreateUserDto) {
//     const newUser = new this.userModel(createUserDto);
//     return newUser.save();
//   }

//   getUser() {
//     return this.userModel.find();
//   }

//   getUserById(id: string) {
//     return this.userModel.findById(id);
//   }

//   updateduser(id: string, userData: UpdateUserDto) {
//     return this.userModel.findByIdAndUpdate(id, userData, { new: true });
//   }
// }

// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/User.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(email: string): Promise<User> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async create(user: CreateUserDto): Promise<CreateUserDto> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).select('+password').exec();
  }

  async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
