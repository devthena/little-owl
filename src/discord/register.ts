import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import {
  AccountLink,
  AccountUnlink,
  CoinFlip,
  EightBall,
  Gamble,
  Give,
  Help,
  Leaderboard,
  Points,
  Profile,
  Star,
} from './commands';

require('dotenv').config();

const register = (): void => {
  if (!process.env.DISCORD_TOKEN) {
    return console.error('Bot Register Command: Missing Token.');
  }

  if (!process.env.DISCORD_CLIENT_ID) {
    return console.error('Bot Register Command: Missing Client ID.');
  }

  if (!process.env.SERVER_ID) {
    return console.error('Bot Register Command: Missing Server ID.');
  }

  if (!process.env.ADMIN_SERVER_ID) {
    return console.error('Bot Register Command: Missing Admin Server ID.');
  }

  const commands = [];
  const commandsGlobal = [];
  const commandsStage = [];

  // commands ready for production should be added here
  commands.push(AccountLink.data.toJSON());
  commands.push(AccountUnlink.data.toJSON());
  commands.push(CoinFlip.data.toJSON());
  commands.push(EightBall.data.toJSON());
  commands.push(Gamble.data.toJSON());
  commands.push(Give.data.toJSON());
  commands.push(Leaderboard.data.toJSON());
  commands.push(Points.data.toJSON());
  commands.push(Profile.data.toJSON());
  commands.push(Star.data.toJSON());

  // commands in development for testing should be added here
  commandsStage.push(Profile.data.toJSON());

  // global commands should be added here
  commandsGlobal.push(Help.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  if (commands.length > 0)
    rest
      .put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          process.env.SERVER_ID
        ),
        { body: commands }
      )
      .then(_data =>
        console.log('Successfully registered PROD Discord commands.')
      )
      .catch(console.error);

  if (commandsGlobal.length > 0)
    rest
      .put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
        body: commandsGlobal,
      })
      .then(_data =>
        console.log('Successfully registered GLOBAL Discord commands.')
      )
      .catch(console.error);

  if (commandsStage.length > 0)
    rest
      .put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          process.env.ADMIN_SERVER_ID
        ),
        { body: commandsStage }
      )
      .then(_data =>
        console.log('Successfully registered STAGE Discord commands.')
      )
      .catch(console.error);
};

register();
