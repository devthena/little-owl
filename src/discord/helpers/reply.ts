import { ColorResolvable, EmbedBuilder, MessageFlags } from 'discord.js';

import { CONFIG } from '@/constants';
import { LogCode } from '@/enums/logs';
import { ReplyProps } from '@/interfaces/bot';

import { log } from './log';

export const reply = async ({
  content,
  ephemeral,
  interaction,
}: ReplyProps) => {
  try {
    const botEmbed = new EmbedBuilder()
      .setColor(CONFIG.COLORS.BLUE as ColorResolvable)
      .setDescription(content);

    await interaction.reply({
      embeds: [botEmbed],
      ...(ephemeral && { flags: MessageFlags.Ephemeral }),
    });
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};
