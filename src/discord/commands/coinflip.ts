import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { BotsProps } from 'src/types';

import { CONFIG, COPY, EMOJIS } from '../../constants';
import { weightedRandom } from '../../lib';

export const CoinFlip = {
  data: new SlashCommandBuilder()
    .setName(COPY.COINFLIP.NAME)
    .setDescription(COPY.COINFLIP.DESCRIPTION),
  execute: async (Bots: BotsProps, interaction: CommandInteraction) => {
    if (!CONFIG.FEATURES.COINFLIP.ENABLED) {
      Bots.reply({
        content: COPY.DISABLED,
        ephimeral: true,
        interaction: interaction,
        source: COPY.COINFLIP.NAME,
      });
      return;
    }

    const probability = { Heads: 0.5, Tails: 0.5 };
    const result = weightedRandom(probability);

    Bots.reply({
      content: `You got... ${result}! ${EMOJIS.CURRENCY}`,
      ephimeral: false,
      interaction: interaction,
      source: COPY.COINFLIP.NAME,
    });
  },
  getName: (): string => {
    return COPY.COINFLIP.NAME;
  },
};
