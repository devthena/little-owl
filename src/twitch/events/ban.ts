import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';
import { getENV } from '@/lib/config';
import { deleteUserByTwitchUsername } from '@/services/user';

export const onBan = async (
  Bots: BotsProps,
  channel: string,
  username: string,
  _reason: string
) => {
  const { MONGODB_USERS } = getENV();

  Bots.log({
    type: LogCode.Leave,
    description: `${username} has been banned from ${channel}!`,
  });

  await deleteUserByTwitchUsername(Bots.log, username);

  Bots.log({
    type: LogCode.Deleted,
    description: `Record for ${username} has been removed from collection ${MONGODB_USERS}.`,
    footer: `Twitch Username: ${username}`,
  });
};
