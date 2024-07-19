import { GuildBan } from 'discord.js';

import { LogEventType } from '@/enums';
import { BotsProps } from '@/types';

export const onGuildBanAdd = async (Bots: BotsProps, guildBan: GuildBan) => {
  const { user, reason } = guildBan;
  const reasonStr = reason ? `\nReason: ${reason}` : '';

  Bots.log({
    type: LogEventType.Leave,
    description: `${user.username} has been banned from the server.${reasonStr}`,
    thumbnail: user.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${user.id}`,
  });

  try {
    await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .findOneAndDelete({ discord_id: user.id });

    Bots.log({
      type: LogEventType.Deleted,
      description: `Record with discord_id=${user.username} has been removed from collection ${Bots.env.MONGODB_USERS}.`,
      thumbnail: user.displayAvatarURL() || undefined,
      footer: `Discord User ID: ${user.id}`,
    });
  } catch (error) {
    const description = `Discord Database Error (guildBanAdd):\nError deleting record with discord_id=${user.username} from collection ${Bots.env.MONGODB_USERS}.`;

    Bots.log({
      type: LogEventType.Error,
      description: description + `\n\nDetails:\n${JSON.stringify(error)}`,
      thumbnail: user.displayAvatarURL() || undefined,
    });
  }
};
