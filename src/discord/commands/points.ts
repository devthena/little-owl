import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { CONFIG, COPY, EMOJIS } from '@/constants';
import { BotsProps } from '@/interfaces/bot';
import { UserObject } from '@/interfaces/user';

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
      });
      return;
    }

    Bots.reply({
      content: `Your current balance is: ${user.cash} ${EMOJIS.CURRENCY}`,
      ephimeral: false,
      interaction: interaction,
    });
  },
  getName: (): string => {
    return COPY.POINTS.NAME;
  },
};
