import {
  Collection,
  GuildTextBasedChannel,
  Message,
  Snowflake,
} from 'discord.js';

import { BotsProps } from 'src/types';
import { LogEventType } from '../../enums';

export const onMessageDeleteBulk = async (
  Bots: BotsProps,
  messages: Collection<Snowflake, Message>,
  channel: GuildTextBasedChannel
) => {
  messages.map(message => {
    if (/bot-/.test(channel.name)) return;

    let logMessage = `Message Deleted In: ${channel}\nAuthor: ${message.author.username}`;
    const text = message.cleanContent.length > 0 ? message.cleanContent : null;

    if (text) logMessage += `\n\nContent: ${text}`;

    if (message.attachments.size > 0) {
      logMessage += `\n\nAttached Files:`;
      message.attachments.forEach(message => {
        logMessage += `\n${message.url}`;
      });
    }

    Bots.log({
      type: LogEventType.Deleted,
      description: logMessage,
      authorIcon: message.guild?.iconURL() || undefined,
      thumbnail: message.author.displayAvatarURL() || undefined,
      footer: `Discord User ID: ${message.author.id}\nPosted on ${message.createdAt}`,
    });
  });
};
