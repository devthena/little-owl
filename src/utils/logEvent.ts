import { EmbedBuilder } from 'discord.js';
import { LogProps, StringObjectProps } from 'src/interfaces';
import { LogChannelId } from '../enums';

const channelMap: StringObjectProps = {
  activity: LogChannelId.Activity,
  alert: LogChannelId.Alert,
  deleted: LogChannelId.Deleted,
  error: LogChannelId.Error,
  leave: LogChannelId.Leave,
  user: LogChannelId.User,
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
