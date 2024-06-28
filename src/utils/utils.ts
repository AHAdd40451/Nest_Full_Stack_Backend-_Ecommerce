/* eslint-disable prettier/prettier */
import mongoose from "mongoose";

export const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);
