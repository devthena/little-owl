import { CommandInteraction } from 'discord.js';
import { ScheduledTask } from 'node-cron';

import { LogCode } from '@/enums/logs';

export interface BotState {
  activityIndex: number;
  cooldowns: {
    stream: Date;
  };
  reminderIndex: number;
  timers: ScheduledTask[];
  twitchChatQueue: number;
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
  ephemeral: boolean;
  interaction: CommandInteraction;
}
