import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotsProps, UserProps } from 'src/interfaces';
import { CURRENCY } from '../../constants';
import { DiscordCommandName, LogEventType } from '../../enums';
import { logEvent } from '../../utils';

export const Points = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.Points)
    .setDescription('Display the amount of points you have'),
  execute: async (
    Bots: BotsProps,
    interaction: CommandInteraction,
    user: UserProps
  ) => {
    try {
      await interaction.reply(
        `Your current balance is: ${user.cash} ${CURRENCY.EMOJI}`
      );
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Discord Command Error (Points): ` + JSON.stringify(err),
      });
      console.error(err);
    }
  },
  getName: (): string => {
    return DiscordCommandName.Points;
  },
};
