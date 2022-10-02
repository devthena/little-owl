import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Gamble, Help, Points } from './commands';

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

  const commands = [];

  commands.push(Gamble.data.toJSON());
  commands.push(Help.data.toJSON());
  commands.push(Points.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  rest
    .put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.SERVER_ID
      ),
      { body: commands }
    )
    .then(_data => console.log('Successfully registered Discord commands.'))
    .catch(console.error);
};

register();
