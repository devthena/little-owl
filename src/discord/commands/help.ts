import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { BotsProps } from 'src/interfaces';
import { DiscordCommandName, LogEventType, WebURL } from '../../enums';
import { logEvent } from '../../utils';

export const Help = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.Help)
    .setDescription('Display helpful links about commands and FAQ'),
  execute: async (Bots: BotsProps, interaction: CommandInteraction) => {
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

    try {
      await interaction.reply({
        content: 'Here are some links you might be interested in:',
        components: [row],
      });
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Discord Command Error (Help): ` + JSON.stringify(err),
      });
      console.error(err);
    }
  },
  getName: (): string => {
    return DiscordCommandName.Help;
  },
};
