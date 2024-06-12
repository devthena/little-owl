import { Message } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import { BotsProps } from 'src/interfaces';
import { UserObject } from 'src/schemas';
import { NEW_USER } from '../../constants';
import { AdminChannelId, DiscordChannelId, LogEventType } from '../../enums';
import { logEvent } from '../../utils';
import { addUser, getUserById } from '../../utils/db';

export const onMessageCreate = async (Bots: BotsProps, message: Message) => {
  if (!message.guild?.available) return;
  if (!message.channel.isTextBased()) return;
  if (!message.member) return;
  if (message.author.bot) return;
  if (message.author.system) return;

  if (message.guild.id === Bots.env.ADMIN_SERVER_ID) {
    const server = Bots.discord.guilds.cache.get(Bots.env.SERVER_ID);
    if (!server?.available) return;

    let channel = null;

    if (message.channel.id === AdminChannelId.Message) {
      channel = server.channels.cache.get(DiscordChannelId.Announcements);
    } else if (message.channel.id === AdminChannelId.Stage) {
      channel = server.channels.cache.get(DiscordChannelId.Stage);
    }

    if (channel?.isTextBased()) {
      channel.send({
        content: message.content,
        files: [...message.attachments.values()],
      });
    }

    return;
  }

  if (message.guild.id !== Bots.env.SERVER_ID) return;

  const words = message.content.split(/ +/g);
  const pattern = new RegExp('[A-Za-z].{2,}');

  const isValidMsg = words.length > 2 && words.some(word => pattern.test(word));
  const isValidAttachment = !!message.attachments.first();
  const isValid = isValidMsg || isValidAttachment;

  if (!isValid) return;

  const document = await getUserById(Bots, message.member.id);
  const incAmount = isValidAttachment ? 2 : 1;

  if (!document) {
    const userData: UserObject = {
      ...NEW_USER,
      user_id: uuidv4(),
      discord_id: message.member.id,
      discord_username: message.member.user.username,
      discord_name: message.member.user.globalName,
      cash: NEW_USER.cash + incAmount,
    };

    return await addUser(Bots, userData);
  }

  try {
    await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .updateOne(
        { discord_id: message.member.id },
        { $inc: { cash: incAmount } }
      );
  } catch (err) {
    logEvent({
      Bots,
      type: LogEventType.Error,
      description:
        `Discord Database Error (messageCreate): ` + JSON.stringify(err),
    });
    console.error(err);
  }
};
