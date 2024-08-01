import { Message } from 'discord.js';

import { CONFIG } from '@/constants';
import { discord } from '@/lib/clients';
import { getENV } from '@/lib/config';

import { findOrCreateDiscordUser, incDiscordUser } from '@/services/user';

export const onMessageCreate = async (message: Message) => {
  if (!message.guild?.available) return;
  if (!message.channel.isTextBased()) return;
  if (!message.member) return;
  if (message.author.system) return;
  if (message.author.bot && message.author.id !== discord.user?.id) return;

  const { ADMIN_SERVER_ID, SERVER_ID } = getENV();

  if (message.guild.id === ADMIN_SERVER_ID) {
    const server = discord.guilds.cache.get(SERVER_ID);
    if (!server?.available) return;

    let channel = null;

    if (message.channel.id === CONFIG.CHANNELS.ADMIN.ANNOUNCE) {
      channel = server.channels.cache.get(CONFIG.CHANNELS.MAIN.ANNOUNCE);
    } else if (message.channel.id === CONFIG.CHANNELS.ADMIN.STAGE) {
      channel = server.channels.cache.get(CONFIG.CHANNELS.MAIN.STAGE);
    }

    if (channel?.isTextBased()) {
      channel.send({
        content: message.content,
        embeds: [...message.embeds],
        files: [...message.attachments.values()],
      });
    }

    return;
  }

  if (message.guild.id !== SERVER_ID) return;
  if (message.author.id === discord.user?.id) return;

  const words = message.content.split(/ +/g);
  const pattern = new RegExp('[A-Za-z].{2,}');

  const isValidMsg = words.length > 2 && words.some(word => pattern.test(word));
  const isValidAttachment = !!message.attachments.first();
  const incAmount = isValidAttachment ? 2 : 1;
  const isValid = isValidMsg || isValidAttachment;

  if (!isValid) return;

  await findOrCreateDiscordUser(message.member.user);
  await incDiscordUser(message.member.id, { cash: incAmount });
};
