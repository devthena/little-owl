import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { CONFIG } from '../../constants';

export const Help = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display helpful links about commands and FAQ'),
  execute: async (interaction: CommandInteraction) => {
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Commands')
          .setStyle(ButtonStyle.Link)
          .setURL(CONFIG.URLS.COMMANDS)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel('FAQ')
          .setStyle(ButtonStyle.Link)
          .setURL(CONFIG.URLS.FAQ)
      );

    await interaction.reply({
      content: 'Here are some links you might be interested in:',
      components: [row],
    });
  },
};
