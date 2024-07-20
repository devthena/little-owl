import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';
import { deleteTwitchUser } from '@/services/user';

export const onBan = async (
  Bots: BotsProps,
  channel: string,
  username: string,
  _reason: string
) => {
  Bots.log({
    type: LogCode.Leave,
    description: `${username} has been banned from ${channel}!`,
  });

  await deleteTwitchUser(Bots, username);

  Bots.log({
    type: LogCode.Deleted,
    description: `Record with username=${username} has been removed from collection ${Bots.env.MONGODB_USERS}.`,
    footer: `Twitch Username: ${username}`,
  });
};
