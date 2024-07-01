import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';

import { BotsProps } from 'src/types';

import { LogEventType } from '../../enums';
import { CONFIG, COPY } from '../../constants';

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
  execute: async (Bots: BotsProps, interaction: CommandInteraction) => {
    if (!CONFIG.FEATURES.EIGHTBALL.ENABLED) {
      try {
        await interaction.reply({ content: COPY.DISABLED, ephemeral: true });
      } catch (error) {
        Bots.log({
          type: LogEventType.Error,
          description:
            `Discord Command Error (8-Ball): ` + JSON.stringify(error),
        });
      }
      return;
    }

    const randomNum = Math.floor(
      Math.random() * COPY.EIGHTBALL.RESPONSES.length
    );
    const answer = COPY.EIGHTBALL.RESPONSES[randomNum];

    try {
      await interaction.reply(`:8ball: says.. ${answer}`);
    } catch (error) {
      Bots.log({
        type: LogEventType.Error,
        description: `Discord Command Error (8Ball): ` + JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.EIGHTBALL.NAME;
  },
};
