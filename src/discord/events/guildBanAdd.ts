import { GuildBan } from 'discord.js';

import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';
import { getENV } from '@/lib/config';

import { deleteActivity } from '@/services/activities';
import { deleteStats } from '@/services/statistics';
import { deleteUser } from '@/services/user';

export const onGuildBanAdd = async (Bots: BotsProps, guildBan: GuildBan) => {
  const { MONGODB_ACTS, MONGODB_STATS, MONGODB_USERS } = getENV();
  const { user, reason } = guildBan;
  const reasonStr = reason ? `\nReason: ${reason}` : '';

  Bots.log({
    type: LogCode.Leave,
    description: `${user.username} has been banned from the server.${reasonStr}`,
    thumbnail: user.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${user.id}`,
  });

  await deleteActivity(Bots.log, user.id);

  Bots.log({
    type: LogCode.Deleted,
    description: `Record for ${user.username} has been removed from collection ${MONGODB_ACTS}.`,
    thumbnail: user.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${user.id} | Display Name: ${user.displayName}`,
  });

  await deleteStats(Bots.log, user.id);

  Bots.log({
    type: LogCode.Deleted,
    description: `Record for ${user.username} has been removed from collection ${MONGODB_STATS}.`,
    thumbnail: user.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${user.id} | Display Name: ${user.displayName}`,
  });

  await deleteUser(Bots.log, user.id);

  Bots.log({
    type: LogCode.Deleted,
    description: `Record for ${user.username} has been removed from collection ${MONGODB_USERS}.`,
    thumbnail: user.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${user.id} | Display Name: ${user.displayName}`,
  });
};
