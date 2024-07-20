import { ColorResolvable, EmbedBuilder } from 'discord.js';

import { CONFIG } from '@/constants';
import { LogCode } from '@/enums/logs';
import { BotsProps, ReplyProps } from '@/interfaces/bot';

export const discordReply = async (
  Bots: BotsProps,
  { content, ephimeral, interaction }: ReplyProps
) => {
  try {
    const botEmbed = new EmbedBuilder()
      .setColor(CONFIG.COLORS.BLUE as ColorResolvable)
      .setDescription(content);

    await interaction.reply({ embeds: [botEmbed], ephemeral: ephimeral });
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};
