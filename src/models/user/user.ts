import { Schema, model, Document } from 'mongoose';
import { connectToDatabase } from '../../db';
import { appConfig } from '../../config';

connectToDatabase();

interface IUser extends Document {
  user_id: string;
  discord_id: string;
  discord_username: string;
  twitch_id: string;
  twitch_username: string;
  accounts_linked: boolean;
  cash: number;
  bank: number;
  stars: number;
  power_ups: object;
}

export const userSchema = new Schema<IUser>(
  {
    user_id: {
      type: String,
      required: true,
    },
    discord_id: {
      type: String,
      default: null,
    },
    discord_username: {
      type: String,
      default: null,
    },
    twitch_id: {
      type: String,
      default: null,
    },
    twitch_username: {
      type: String,
      default: null,
    },
    accounts_linked: {
      type: Boolean,
      default: false,
    },
    cash: {
      type: Number,
      default: 0,
    },
    bank: {
      type: Number,
      default: 0,
    },
    stars: {
      type: Number,
      default: 0,
    },
    power_ups: {
      type: Object,
      default: {},
    },
  },
  {
    collection: appConfig.env.MONGODB_USERS,
  }
);

export const User = model('User', userSchema);
