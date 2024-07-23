import { Document } from 'mongoose';

export interface UserDocument extends Document {
  user_id: string;
  discord_id: string | null;
  discord_username: string | null;
  discord_name: string | null;
  twitch_id: string | null;
  twitch_username: string | null;
  cash: number;
  bank?: number;
  stars?: number;
}

export type UserIncrementFields = {
  cash?: number;
  bank?: number;
  stars?: number;
};
