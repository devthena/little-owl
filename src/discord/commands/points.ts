import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CURRENCY } from 'src/constants';
import { UserProps } from 'src/interfaces';
import { COMMAND_NAMES_DISCORD } from './constants';

// @todo: add error handling for await statements

export const Points = {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAMES_DISCORD.POINTS)
    .setDescription('Display the amount of points you have'),
  execute: async (interaction: CommandInteraction, user: UserProps) => {
    await interaction.reply(
      `Your current balance is: ${user.cash} ${CURRENCY.EMOJI}`
    );
  },
  getName: (): string => {
    return COMMAND_NAMES_DISCORD.POINTS;
  },
};
