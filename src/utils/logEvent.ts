import { EmbedBuilder } from 'discord.js';
import { CONFIG } from '../constants';
import { BotsProps, StringObjectProps } from 'src/interfaces';

interface LogProps {
  Bots: BotsProps;
  type: string;
  description: string;
  authorIcon?: string;
  thumbnail?: string;
  footer?: string;
}

const channelMap: StringObjectProps = {
  activity: CONFIG.CHANNELS.LOGS.ACTIVITIES,
  alert: CONFIG.CHANNELS.LOGS.ALERTS,
  deleted: CONFIG.CHANNELS.LOGS.DELETED,
  leave: CONFIG.CHANNELS.LOGS.LEAVERS,
  user: CONFIG.CHANNELS.LOGS.USERS,
};

export const logEvent = (props: LogProps) => {
  const server = props.Bots.discord.guilds.cache.get(
    props.Bots.env.ADMIN_SERVER_ID
  );

  if (server && server.available) {
    const channel = server.channels.cache.get(channelMap[props.type]);

    if (channel) {
      const botEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${server.name} Server`,
          iconURL: props.authorIcon || server.iconURL() || '',
        })
        .setDescription(props.description);

      if (props.thumbnail) botEmbed.setThumbnail(props.thumbnail);
      if (props.footer) botEmbed.setFooter({ text: props.footer });

      if (channel.isTextBased()) channel.send({ embeds: [botEmbed] });
    }
  }
};
