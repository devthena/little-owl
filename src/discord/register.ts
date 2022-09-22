import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Gamble, Help, Info, Magic8Ball, Points } from './commands';

const commands = [];

commands.push(Magic8Ball.data.toJSON());
commands.push(Gamble.data.toJSON());
commands.push(Help.data.toJSON());
commands.push(Info.data.toJSON());
commands.push(Points.data.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN || '');

rest
  .put(
    Routes.applicationGuildCommands(
      process.env.DISCORD_CLIENT_ID || '',
      process.env.SERVER_ID || ''
    ),
    { body: commands }
  )
  .then(_data => console.log('Successfully registered Discord commands.'))
  .catch(console.error);
