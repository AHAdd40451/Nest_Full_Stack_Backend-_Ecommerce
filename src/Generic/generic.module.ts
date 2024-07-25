import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenericService } from './generic.service';
import { User, UserSchema } from '../schemas/User.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Provide User model
  ],
  providers: [GenericService],
  exports: [GenericService],
})
export class GenericModule {}
