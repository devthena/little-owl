import { Client } from 'discord.js';

export const onReady = (Bot: Client) => {
  console.log('* LittleOwl is online *');

  // TODO: Register slash comands for the bot
  if (!Bot.application?.commands) console.log('Test');
};
