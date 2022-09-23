import { Client, EmbedBuilder } from 'discord.js';
import { CONFIG } from '../constants';
import { StringObjectProps } from 'src/interfaces';

const channelMap: StringObjectProps = {
  activity: CONFIG.CHANNELS.LOGS.ACTIVITIES,
  alert: CONFIG.CHANNELS.LOGS.ALERTS,
  timeout: CONFIG.CHANNELS.LOGS.TIMEOUTS,
  user: CONFIG.CHANNELS.LOGS.USERS,
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
