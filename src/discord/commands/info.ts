import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { COMMAND_NAMES_DISCORD } from './constants';

export const Info = {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAMES_DISCORD.INFO)
    .setDescription('Display information about the bot'),
  execute: async (interaction: CommandInteraction) => {
    // TODO: Add handler for info command
    await interaction.reply('');
  },
  getName: (): string => {
    return COMMAND_NAMES_DISCORD.INFO;
  },
};
