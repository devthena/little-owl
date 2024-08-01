import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';

import { CONFIG, COPY } from '@/constants';
import { reply } from '../helpers';

export const EightBall = {
  data: new SlashCommandBuilder()
    .setName(COPY.EIGHTBALL.NAME)
    .setDescription(COPY.EIGHTBALL.DESCRIPTION)
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName(COPY.EIGHTBALL.OPTION_NAME)
        .setDescription(COPY.EIGHTBALL.OPTION_DESCRIPTION)
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction) => {
    if (!CONFIG.FEATURES.EIGHTBALL.ENABLED) {
      reply({
        content: COPY.DISABLED,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    const randomNum = Math.floor(
      Math.random() * COPY.EIGHTBALL.RESPONSES.length
    );

    const answer = COPY.EIGHTBALL.RESPONSES[randomNum];

    reply({
      content: `:8ball: says.. ${answer}`,
      ephimeral: false,
      interaction: interaction,
    });
  },
  getName: (): string => {
    return COPY.EIGHTBALL.NAME;
  },
};
