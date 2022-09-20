import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const Info = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Display information about the bot'),
  execute: async (interaction: CommandInteraction) => {
    // TODO: Add handler for info command
    await interaction.reply('');
  },
};
