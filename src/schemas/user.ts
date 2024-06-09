import { ObjectId } from 'mongodb';

export type UserObject = {
  _id?: ObjectId;
  user_id: string;
  discord_id: string | null;
  discord_username: string | null;
  discord_name: string | null;
  twitch_id: string | null;
  twitch_username: string | null;
  cash: number;
  bank: number;
  stars: number;
  power_ups: string[];
};
