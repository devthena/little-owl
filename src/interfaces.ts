import * as djs from 'discord.js';
import * as tmi from 'tmi.js';
import { Db } from 'mongodb';

export interface BotsProps {
  db: Db | null;
  discord: djs.Client<boolean>;
  twitch: tmi.Client;
}

export interface ObjectProps {
  [key: string]: any;
}

export interface StringObjectProps {
  [key: string]: string;
}

export interface TwitchUserProps {
  twitch_id: string;
  username: string;
  points: number;
  last_chat?: string;
}
