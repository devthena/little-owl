import { ColorResolvable, EmbedBuilder } from 'discord.js';

import { BotsProps, ReplyProps } from 'src/types';

import { CONFIG } from '../constants';
import { LogEventType } from '../enums';

export const discordReply = async (
  Bots: BotsProps,
  { content, ephimeral, interaction, source }: ReplyProps
) => {
  try {
    const botEmbed = new EmbedBuilder()
      .setColor(CONFIG.COLORS.BLUE as ColorResolvable)
      .setDescription(content);

    await interaction.reply({ embeds: [botEmbed], ephemeral: ephimeral });
  } catch (error) {
    Bots.log({
      type: LogEventType.Error,
      description: `Discord Reply Error (${source}): ` + JSON.stringify(error),
    });
  }
};
