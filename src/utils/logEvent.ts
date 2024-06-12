import { ColorResolvable, EmbedBuilder } from 'discord.js';
import { LogProps } from 'src/interfaces';
import { LogChannelId } from '../enums';
import { COLORS } from '../constants';

const typeMap = {
  activity: {
    channel: LogChannelId.Activity,
    color: COLORS.BLUE,
  },
  alert: {
    channel: LogChannelId.Alert,
    color: COLORS.PINK,
  },
  deleted: {
    channel: LogChannelId.Deleted,
    color: COLORS.RED,
  },
  error: {
    channel: LogChannelId.Error,
    color: COLORS.RED,
  },
  leave: {
    channel: LogChannelId.Leave,
    color: COLORS.YELLOW,
  },
  user: {
    channel: LogChannelId.User,
    color: COLORS.BLUE,
  },
};

export const logEvent = ({
  Bots,
  type,
  description,
  authorIcon,
  thumbnail,
  footer,
}: LogProps) => {
  const server = Bots.discord.guilds.cache.get(Bots.env.ADMIN_SERVER_ID);

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
