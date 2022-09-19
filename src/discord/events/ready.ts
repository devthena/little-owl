import { Client } from 'discord.js';

export const onReady = async (Bot: Client) => {
  console.log('* LittleOwl is online *');

  if (!Bot.application?.commands) await Bot.application?.fetch();

  if (!process.env.DEV) {
    // TODO: Register slash commands for the bot
    // await Bot.application?.commands.set(commands);
    // TODO: Start a timer for updating bot activity
    // startTimer(Bot);
  }
};
