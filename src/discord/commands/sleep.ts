import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { CONFIG, COPY } from '@/constants';
import { BotState } from '@/interfaces/bot';
import { sleepTime } from '@/lib/config';

import { reply } from '../helpers';

export const Sleep = {
  data: new SlashCommandBuilder()
    .setName(COPY.SLEEP.NAME)
    .setDescription(COPY.SLEEP.DESCRIPTION),
  execute: async (state: BotState, interaction: CommandInteraction) => {
    if (!CONFIG.FEATURES.SLEEP.ENABLED) {
      reply({
        content: COPY.DISABLED,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    reply({
      content: '🦉 Little Owl: Good night!',
      ephimeral: false,
      interaction: interaction,
    });

    sleepTime(state);
  },
  getName: (): string => {
    return COPY.SLEEP.NAME;
  },
};
