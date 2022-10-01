import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { DiscordUserProps } from 'src/interfaces';
import { CONFIG } from '../../constants';

export const Points = {
  data: new SlashCommandBuilder()
    .setName('points')
    .setDescription('Display the amount of points you have'),
  execute: async (interaction: CommandInteraction, user: DiscordUserProps) => {
    await interaction.reply(
      `Your current balance is: ${user.points} ${CONFIG.CURRENCY.EMOJI}`
    );
  },
};
