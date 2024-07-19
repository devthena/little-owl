import { Client } from 'discord.js';
import { discordBotTimer } from '@/lib';

export const onReady = async (Bot: Client) => {
  console.log('* Discord LittleOwl is online *');
  discordBotTimer(Bot);
};
