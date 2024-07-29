import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenericService } from './generic.service';
@Module({
  imports: [],
  providers: [GenericService],
  exports: [GenericService],
})
export class GenericModule {}
