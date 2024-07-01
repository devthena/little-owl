import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { UserObject } from 'src/schemas';
import { BotsProps } from 'src/types';

import { CONFIG, COPY, EMOJIS } from '../../constants';
import { LogEventType } from '../../enums';
import { logEvent } from '../../utils';

export const Points = {
  data: new SlashCommandBuilder()
    .setName(COPY.POINTS.NAME)
    .setDescription(COPY.POINTS.DESCRIPTION),
  execute: async (
    Bots: BotsProps,
    interaction: CommandInteraction,
    user: UserObject
  ) => {
    if (!CONFIG.FEATURES.POINTS.ENABLED) {
      try {
        await interaction.reply({ content: COPY.DISABLED, ephemeral: true });
      } catch (error) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description:
            `Discord Command Error (Points): ` + JSON.stringify(error),
        });
      }
      return;
    }

    try {
      await interaction.reply(
        `Your current balance is: ${user.cash} ${EMOJIS.CURRENCY}`
      );
    } catch (error) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Discord Command Error (Points): ` + JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.POINTS.NAME;
  },
};
