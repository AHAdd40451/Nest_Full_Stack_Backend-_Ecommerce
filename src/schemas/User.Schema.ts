/* eslint-disable prettier/prettier */
// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  username: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  role: string;

  async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async validPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to automatically hash the password before saving
UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    next();
  } catch (error) {
    next(error);
  }
});
