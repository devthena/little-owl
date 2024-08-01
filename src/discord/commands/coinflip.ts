import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { CONFIG, COPY, EMOJIS } from '@/constants';
import { weightedRandom } from '@/lib/utils';

import { reply } from '../helpers';

export const CoinFlip = {
  data: new SlashCommandBuilder()
    .setName(COPY.COINFLIP.NAME)
    .setDescription(COPY.COINFLIP.DESCRIPTION),
  execute: async (interaction: CommandInteraction) => {
    if (!CONFIG.FEATURES.COINFLIP.ENABLED) {
      reply({
        content: COPY.DISABLED,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    const probability = { Heads: 0.5, Tails: 0.5 };
    const result = weightedRandom(probability);

    reply({
      content: `You got... ${result}! ${EMOJIS.CURRENCY}`,
      ephimeral: false,
      interaction: interaction,
    });
  },
  getName: (): string => {
    return COPY.COINFLIP.NAME;
  },
};
