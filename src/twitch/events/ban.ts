import { LogEventType } from '@/enums';
import { deleteTwitchUser } from '@/services/user';
import { BotsProps } from '@/types';

export const onBan = async (
  Bots: BotsProps,
  channel: string,
  username: string,
  _reason: string
) => {
  Bots.log({
    type: LogEventType.Leave,
    description: `${username} has been banned from ${channel}!`,
  });

  await deleteTwitchUser(Bots, username);

  Bots.log({
    type: LogEventType.Deleted,
    description: `Record with username=${username} has been removed from collection ${Bots.env.MONGODB_USERS}.`,
    footer: `Twitch Username: ${username}`,
  });
};
