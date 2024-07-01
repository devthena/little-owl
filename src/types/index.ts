import * as djs from 'discord.js';
import * as tmi from 'tmi.js';
import { Db } from 'mongodb';

import { LogEventType } from '../enums';

export interface BotsProps {
  cooldowns: ObjectProps;
  db: Db | null;
  discord: djs.Client<boolean>;
  env: { [key: string]: string };
  log: Function;
  twitch: tmi.Client;
}

export interface LogProps {
  type: LogEventType;
  description: string;
  authorIcon?: string;
  thumbnail?: string;
  footer?: string;
}

export interface ObjectProps {
  [key: string]: any;
}
