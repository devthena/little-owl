import * as djs from 'discord.js';
import * as tmi from 'tmi.js';

import { Db } from 'mongodb';

import { LogCode } from '@/enums/logs';

export interface BotsProps {
  cooldowns: ObjectProps;
  db: Db | null;
  discord: djs.Client<boolean>;
  env: { [key: string]: string };
  log: Function;
  reply: Function;
  twitch: tmi.Client;
}

export interface LogProps {
  type: LogCode;
  description: string;
  authorIcon?: string;
  thumbnail?: string;
  footer?: string;
}

export interface ObjectProps {
  [key: string]: any;
}

export interface ReplyProps {
  content: string;
  ephimeral: boolean;
  interaction: djs.CommandInteraction;
}