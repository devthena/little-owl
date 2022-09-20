import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const Points = {
  data: new SlashCommandBuilder()
    .setName('points')
    .setDescription('Display the amount of points you have'),
  execute: async (interaction: CommandInteraction) => {
    // TODO: Add handler for points command
    await interaction.reply('');
  },
};
