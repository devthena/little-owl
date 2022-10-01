import { EmbedBuilder } from 'discord.js';
import { CONFIG } from '../constants';
import { BotsProps, StringObjectProps } from 'src/interfaces';

const channelMap: StringObjectProps = {
  activity: CONFIG.CHANNELS.LOGS.ACTIVITIES,
  alert: CONFIG.CHANNELS.LOGS.ALERTS,
  timeout: CONFIG.CHANNELS.LOGS.TIMEOUTS,
  user: CONFIG.CHANNELS.LOGS.USERS,
};

export const logEvent = (
  Bots: BotsProps,
  type: string,
  description: string
) => {
  const server = Bots.discord.guilds.cache.get(Bots.env.ADMIN_SERVER_ID);

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
