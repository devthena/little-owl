import { Client, EmbedBuilder } from 'discord.js';
import { StringObjectProps } from '../constants';
import { BOT_CONFIG } from '../discord/constants';

const channelMap: StringObjectProps = {
  activity: BOT_CONFIG.CHANNELS.ACTIVITIES,
  alert: BOT_CONFIG.CHANNELS.ALERTS,
  timeout: BOT_CONFIG.CHANNELS.TIMEOUTS,
  user: BOT_CONFIG.CHANNELS.USERS,
};

export const logEvent = (Bot: Client, type: string, description: string) => {
  const server = Bot.guilds.cache.get(process.env.ADMIN_SERVER_ID || '');

  if (server && server.available) {
    const channel = server.channels.cache.get(channelMap[type]);

    if (channel) {
      const botEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${server.name} Server`,
          iconURL: server.iconURL() || '',
        })
        .setDescription(description);

      if (channel.isTextBased()) channel.send({ embeds: [botEmbed] });
    }
  }
};
