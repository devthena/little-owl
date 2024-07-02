import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { UserObject } from 'src/schemas';
import { BotsProps } from 'src/types';

import { CONFIG, COPY, EMOJIS } from '../../constants';

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
      Bots.reply({
        content: COPY.DISABLED,
        ephimeral: true,
        interaction: interaction,
        source: COPY.POINTS.NAME,
      });
      return;
    }

    Bots.reply({
      content: `Your current balance is: ${user.cash} ${EMOJIS.CURRENCY}`,
      ephimeral: false,
      interaction: interaction,
      source: COPY.POINTS.NAME,
    });
  },
  getName: (): string => {
    return COPY.POINTS.NAME;
  },
};
