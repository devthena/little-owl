import { CommandInteraction } from 'discord.js';
import { LogCode } from '@/enums/logs';

export interface BotState {
  activity: number;
  cooldowns: {
    cerberus: Map<string, Date>;
    stream: Date;
  };
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
  interaction: CommandInteraction;
}
