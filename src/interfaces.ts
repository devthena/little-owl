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

export interface ObjectProps {
  [key: string]: any;
}

export interface StringObjectProps {
  [key: string]: string;
}

export interface DiscordUserProps {
  discord_id: string;
  discord_name: string;
  discord_tag: string;
  last_message?: string;
  last_star?: string;
  points: number;
  stars: number;
}

export interface TwitchUserProps {
  twitch_id: string;
  username: string;
  points: number;
  last_chat?: string;
}
