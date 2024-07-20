import { GuildBan } from 'discord.js';

import { LogEventType } from '@/enums';
import { deleteDiscordUser } from '@/services/user';
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

  await deleteDiscordUser(Bots, user.id);

  Bots.log({
    type: LogEventType.Deleted,
    description: `Record with discord_id=${user.username} has been removed from collection ${Bots.env.MONGODB_USERS}.`,
    thumbnail: user.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${user.id}`,
  });
};
