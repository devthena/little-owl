import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { CONFIG, COPY, URLS } from '@/constants';
import { LogEventType } from '@/enums';
import { BotsProps } from '@/types';

export const Help = {
  data: new SlashCommandBuilder()
    .setName(COPY.HELP.NAME)
    .setDescription(COPY.HELP.DESCRIPTION),
  execute: async (Bots: BotsProps, interaction: CommandInteraction) => {
    if (!CONFIG.FEATURES.HELP.ENABLED) {
      Bots.reply({
        content: COPY.DISABLED,
        ephimeral: true,
        interaction: interaction,
        source: COPY.HELP.NAME,
      });
      return;
    }

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setEmoji('📚')
          .setLabel('Commands')
          .setStyle(ButtonStyle.Link)
          .setURL(URLS.COMMANDS)
      )
      .addComponents(
        new ButtonBuilder()
          .setEmoji('📜')
          .setLabel('FAQ')
          .setStyle(ButtonStyle.Link)
          .setURL(URLS.FAQ)
      );

    try {
      await interaction.reply({ components: [row] });
    } catch (error) {
      Bots.log({
        type: LogEventType.Error,
        description:
          `Discord Command Error (${COPY.HELP.NAME}): ` + JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.HELP.NAME;
  },
};
