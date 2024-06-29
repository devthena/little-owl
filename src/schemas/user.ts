import { ObjectId } from 'mongodb';

export type UserObject = {
  _id?: ObjectId;
  user_id: string; // UUID
  discord_id: string | null; // Discord User ID
  discord_username: string | null; // Discord Username
  discord_name: string | null; // Discord Display Name
  twitch_id: string | null; // Twitch User ID
  twitch_username: string | null; // Twitch Username
  cash: number; // Points from Economy System
  gamble_wins?: number; // Total Gamble Wins
  gamble_losses?: number; // Total Gamble Losses
  times_given?: number; // Total Times User Gave Points
};
