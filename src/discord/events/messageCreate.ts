import { Message } from 'discord.js';
import { BotsProps } from 'src/interfaces';

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

  // TODO: Add logic to detect spam messages

  if (!isValid) return;

  if (process.env.MONGODB_USERS) {
    await Bots.db?.collection(process.env.MONGODB_USERS).updateOne(
      { discord_id: message.member.id },
      {
        $set: {
          discord_name: message.member.displayName,
          discord_tag: message.member.user.tag,
          last_message: message.content,
        },
        $inc: {
          points: 1,
        },
      },
      { upsert: true }
    );
  }
};
