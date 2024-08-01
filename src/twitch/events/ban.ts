import { log } from '@/discord/helpers';
import { LogCode } from '@/enums/logs';
import { getENV } from '@/lib/config';
import { deleteUserByTwitchUsername } from '@/services/user';

export const onBan = async (
  channel: string,
  username: string,
  _reason: string
) => {
  const { MONGODB_USERS } = getENV();

  log({
    type: LogCode.Leave,
    description: `${username} has been banned from ${channel}!`,
  });

  await deleteUserByTwitchUsername(username);

  log({
    type: LogCode.Deleted,
    description: `Record for ${username} has been removed from collection ${MONGODB_USERS}.`,
    footer: `Twitch Username: ${username}`,
  });
};
