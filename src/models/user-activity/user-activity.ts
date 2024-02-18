import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { appConfig } from '../../config';
import { starSchema } from './star';

const userActivitySchema = new Schema(
  {
    user_id: {
      type: String,
      required: false,
      default: uuidv4(),
    },
    star: {
      type: starSchema,
      required: false,
    },
  },
  {
    collection: appConfig.env.MONGODB_USER_ACTIVITIES,
  }
);

userActivitySchema.methods.getStar = function () {
  return this.star;
};

export const UserActivity = mongoose.model('UserActivity', userActivitySchema);
