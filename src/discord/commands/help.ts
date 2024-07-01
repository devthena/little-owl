import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { BotsProps } from 'src/types';

import { CONFIG, COPY, URLS } from '../../constants';
import { LogEventType } from '../../enums';

export const Help = {
  data: new SlashCommandBuilder()
    .setName(COPY.HELP.NAME)
    .setDescription(COPY.HELP.DESCRIPTION),
  execute: async (Bots: BotsProps, interaction: CommandInteraction) => {
    if (!CONFIG.FEATURES.HELP.ENABLED) {
      try {
        await interaction.reply({ content: COPY.DISABLED, ephemeral: true });
      } catch (error) {
        Bots.log({
          type: LogEventType.Error,
          description: `Discord Command Error (Help): ` + JSON.stringify(error),
        });
      }
      return;
    }

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Commands')
          .setStyle(ButtonStyle.Link)
          .setURL(URLS.COMMANDS)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel('FAQ')
          .setStyle(ButtonStyle.Link)
          .setURL(URLS.FAQ)
      );

    try {
      await interaction.reply({
        content: 'Here are some links you might be interested in:',
        components: [row],
      });
    } catch (error) {
      Bots.log({
        type: LogEventType.Error,
        description: `Discord Command Error (Help): ` + JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.HELP.NAME;
  },
};
