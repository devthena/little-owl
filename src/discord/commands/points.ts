import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CURRENCY } from 'src/constants';
import { DiscordCommandName } from 'src/enums';
import { UserProps } from 'src/interfaces';

// @todo: add error handling for await statements

export const Points = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.Points)
    .setDescription('Display the amount of points you have'),
  execute: async (interaction: CommandInteraction, user: UserProps) => {
    await interaction.reply(
      `Your current balance is: ${user.cash} ${CURRENCY.EMOJI}`
    );
  },
  getName: (): string => {
    return DiscordCommandName.Points;
  },
};
