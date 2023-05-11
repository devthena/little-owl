import { Message } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import { BotsProps, UserProps } from 'src/interfaces';
import { UserModel } from '../../schemas';

// @todo: add error handling for await statements

export const onMessageCreate = async (Bots: BotsProps, message: Message) => {
  if (!message.guild?.available) return;
  if (!message.channel.isTextBased()) return;
  if (!message.member) return;
  if (message.author.bot) return;
  if (message.author.system) return;

  const words = message.content.split(/ +/g);
  const pattern = new RegExp('[A-Za-z].{2,}');

  const isValidMsg = words.length > 2 && words.some(word => pattern.test(word));
  const isValidAttachment = !!message.attachments.first();
  const isValid = isValidMsg || isValidAttachment;

  if (!isValid) return;

  const document = await Bots.db
    ?.collection(Bots.env.MONGODB_USERS)
    .findOne({ discord_id: message.member.id });

  if (!document) {
    const userData: UserProps = {
      ...UserModel,
      user_id: uuidv4(),
      discord_id: message.member.id,
      discord_username: message.member.user.username,
      cash: 1,
    };

    await Bots.db?.collection(Bots.env.MONGODB_USERS).insertOne(userData);
    return;
  }

  await Bots.db
    ?.collection(Bots.env.MONGODB_USERS)
    .updateOne({ discord_id: message.member.id }, { $inc: { cash: 1 } });
};
