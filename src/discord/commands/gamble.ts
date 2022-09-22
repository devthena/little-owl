import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SERVER_CONFIG } from '../constants';

export const Gamble = {
  data: new SlashCommandBuilder()
    .setName('gamble')
    .setDescription('Play your points for a chance to double it')
    .addStringOption(option =>
      option
        .setName('amount')
        .setDescription('Enter a specific amount, "all" or "half"')
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction) => {
    if (!SERVER_CONFIG.MODS.gameGamble) {
      await interaction.reply('Gambling is not enabled in this server.');
      return;
    }

    // TODO: Add handler for gamble command
    await interaction.reply('');
  },
};
