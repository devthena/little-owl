import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { BotsProps } from 'src/types';

import { CONFIG, COPY, EMOJIS } from '../../constants';
import { LogEventType } from '../../enums';
import { weightedRandom } from '../../utils';

export const CoinFlip = {
  data: new SlashCommandBuilder()
    .setName(COPY.COINFLIP.NAME)
    .setDescription(COPY.COINFLIP.DESCRIPTION),
  execute: async (Bots: BotsProps, interaction: CommandInteraction) => {
    if (!CONFIG.FEATURES.COINFLIP.ENABLED) {
      try {
        await interaction.reply({ content: COPY.DISABLED, ephemeral: true });
      } catch (error) {
        Bots.log({
          type: LogEventType.Error,
          description:
            `Discord Command Error (CoinFlip): ` + JSON.stringify(error),
        });
      }
      return;
    }

    const probability = { Heads: 0.5, Tails: 0.5 };
    const result = weightedRandom(probability);

    try {
      await interaction.reply(`You got... ${result}! ${EMOJIS.CURRENCY}`);
    } catch (error) {
      Bots.log({
        type: LogEventType.Error,
        description:
          `Discord Command Error (CoinFlip): ` + JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.COINFLIP.NAME;
  },
};
