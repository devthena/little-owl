import * as djs from 'discord.js';
import * as tmi from 'tmi.js';
import { Db } from 'mongodb';

export interface BotsProps {
  cooldowns: ObjectProps;
  db: Db | null;
  discord: djs.Client<boolean>;
  env: StringObjectProps;
  twitch: tmi.Client;
}

export interface LogProps {
  Bots: BotsProps;
  type: string;
  description: string;
  authorIcon?: string;
  thumbnail?: string;
  footer?: string;
}

export interface ObjectProps {
  [key: string]: any;
}

export interface StringObjectProps {
  [key: string]: string;
}

export interface UserProps {
  user_id: string;
  discord_id: string | null;
  discord_username: string | null;
  twitch_id: string | null;
  twitch_username: string | null;
  accounts_linked: boolean;
  cash: number;
  bank: number;
  stars: number;
  power_ups: string[];
}
