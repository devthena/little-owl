import { Message } from 'discord.js';

import { LogEventType } from '@/enums';
import { BotsProps } from '@/types';

export const onMessageDelete = async (Bots: BotsProps, message: Message) => {
  let logMessage = `Message Deleted In: ${message.channel}\nAuthor: ${message.author.username}`;
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
};
