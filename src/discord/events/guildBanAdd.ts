import { GuildBan } from 'discord.js';

import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';

import { deleteActivity } from '@/services/activities';
import { deleteStats } from '@/services/statistics';
import { deleteDiscordUser } from '@/services/user';

export const onGuildBanAdd = async (Bots: BotsProps, guildBan: GuildBan) => {
  const { user, reason } = guildBan;
  const reasonStr = reason ? `\nReason: ${reason}` : '';

  Bots.log({
    type: LogCode.Leave,
    description: `${user.username} has been banned from the server.${reasonStr}`,
    thumbnail: user.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${user.id}`,
  });

  await deleteActivity(Bots, user.id);

  Bots.log({
    type: LogCode.Deleted,
    description: `Record with discord_id ${user.username} has been removed from collection ${Bots.env.MONGODB_ACTS}.`,
    thumbnail: user.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${user.id}`,
  });

  await deleteStats(Bots, user.id);

  Bots.log({
    type: LogCode.Deleted,
    description: `Record with discord_id ${user.username} has been removed from collection ${Bots.env.MONGODB_STATS}.`,
    thumbnail: user.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${user.id}`,
  });

  await deleteDiscordUser(Bots, user.id);

  Bots.log({
    type: LogCode.Deleted,
    description: `Record with discord_id ${user.username} has been removed from collection ${Bots.env.MONGODB_USERS}.`,
    thumbnail: user.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${user.id}`,
  });
};
