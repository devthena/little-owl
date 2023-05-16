import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { DiscordCommandName, WebURL } from 'src/enums';

// @todo: add error handling for await statements

export const Help = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.Help)
    .setDescription('Display helpful links about commands and FAQ'),
  execute: async (interaction: CommandInteraction) => {
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Commands')
          .setStyle(ButtonStyle.Link)
          .setURL(WebURL.Commands)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel('FAQ')
          .setStyle(ButtonStyle.Link)
          .setURL(WebURL.FAQ)
      );

    await interaction.reply({
      content: 'Here are some links you might be interested in:',
      components: [row],
    });
  },
  getName: (): string => {
    return DiscordCommandName.Help;
  },
};
