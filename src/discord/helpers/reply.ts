import { ColorResolvable, EmbedBuilder } from 'discord.js';

import { CONFIG } from '@/constants';
import { LogCode } from '@/enums/logs';
import { ReplyProps } from '@/interfaces/bot';

import { log } from './log';

export const reply = async ({
  content,
  ephimeral,
  interaction,
}: ReplyProps) => {
  try {
    const botEmbed = new EmbedBuilder()
      .setColor(CONFIG.COLORS.BLUE as ColorResolvable)
      .setDescription(content);

    await interaction.reply({ embeds: [botEmbed], ephemeral: ephimeral });
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};
