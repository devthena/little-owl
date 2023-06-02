import { v4 as uuidv4 } from 'uuid';
import mongoose, { Schema } from 'mongoose';

import { starSchema } from './star';

const userActivitySchema = new Schema({
  user_id: {
    type: String,
    required: false,
    default: uuidv4(),
  },
  star: {
    type: starSchema,
    required: false,
  },
});

userActivitySchema.methods.getStar = function () {
  return this.star;
};

export const UserActivity = mongoose.model('UserActivity', userActivitySchema);
