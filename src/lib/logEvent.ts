import { Client, ColorResolvable, EmbedBuilder } from 'discord.js';

import { CONFIG } from '@/constants';
import { LogProps } from '@/interfaces/bot';
import { getENV } from '@/lib/config';

const typeMap = {
  activity: {
    channel: CONFIG.CHANNELS.LOGS.ACTIVITY,
    color: CONFIG.COLORS.BLUE,
  },
  alert: {
    channel: CONFIG.CHANNELS.LOGS.ALERT,
    color: CONFIG.COLORS.PINK,
  },
  deleted: {
    channel: CONFIG.CHANNELS.LOGS.DELETED,
    color: CONFIG.COLORS.RED,
  },
  error: {
    channel: CONFIG.CHANNELS.LOGS.ERROR,
    color: CONFIG.COLORS.RED,
  },
  leave: {
    channel: CONFIG.CHANNELS.LOGS.LEAVE,
    color: CONFIG.COLORS.YELLOW,
  },
  user: {
    channel: CONFIG.CHANNELS.LOGS.USER,
    color: CONFIG.COLORS.BLUE,
  },
};

export const logEvent = (
  clientDiscord: Client,
  { type, description, authorIcon, thumbnail, footer }: LogProps
) => {
  const { ADMIN_SERVER_ID } = getENV();
  const server = clientDiscord.guilds.cache.get(ADMIN_SERVER_ID);

  if (server && server.available) {
    const channel = server.channels.cache.get(typeMap[type].channel);

    if (channel) {
      const botEmbed = new EmbedBuilder()
        .setColor(typeMap[type].color as ColorResolvable)
        .setAuthor({
          name: `${server.name} Server`,
          iconURL: authorIcon || server.iconURL() || '',
        })
        .setDescription(description);

      if (thumbnail) botEmbed.setThumbnail(thumbnail);
      if (footer) botEmbed.setFooter({ text: footer });

      if (channel.isTextBased()) channel.send({ embeds: [botEmbed] });
    }
  }
};
