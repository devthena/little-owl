import { Client } from 'discord.js';
import { discordBotTimer } from '../../utils';

export const onReady = async (Bot: Client) => {
  console.log('* Discord LittleOwl is online *');
  discordBotTimer(Bot);
};
