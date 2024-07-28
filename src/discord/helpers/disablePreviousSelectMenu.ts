import {
  ColorResolvable,
  CommandInteraction,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';

import { CONFIG, COPY } from '@/constants';
import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';

export const disablePreviousSelectMenu = async (
  Bots: BotsProps,
  interaction: CommandInteraction
) => {
  if (!Bots.interactions.get(interaction.user.id)) return;

  const oldMessageId = Bots.interactions.get(interaction.user.id);

  if (!oldMessageId) return;

  Bots.interactions.delete(interaction.user.id);

  try {
    const oldMessage = await (
      interaction.channel as TextChannel
    ).messages.fetch(oldMessageId);

    if (oldMessage) {
      const botEmbed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.BLUE as ColorResolvable)
        .setDescription(COPY.ERROR.EXPIRED);

      await oldMessage.edit({ embeds: [botEmbed], components: [] });
    }
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};
