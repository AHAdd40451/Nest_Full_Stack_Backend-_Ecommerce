/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

export const isValidObjectId = (id: string) =>
  mongoose.Types.ObjectId.isValid(id);


dotenv.config();
export function getEnv(key: string): string {
  return process.env[key];
}
