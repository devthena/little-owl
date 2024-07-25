import * as djs from 'discord.js';
import * as tmi from 'tmi.js';

import { LogCode } from '@/enums/logs';

export interface BotsProps {
  cooldowns: ObjectProps;
  discord: djs.Client<boolean>;
  log: Function;
  reply: Function;
  twitch: tmi.Client;
}

export interface LogProps {
  type: LogCode;
  title?: string;
  description: string;
  image?: string;
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
