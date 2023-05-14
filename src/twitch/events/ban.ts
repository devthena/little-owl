import { BotsProps } from 'src/interfaces';
import { LogEventType, logEvent } from '../../utils';

export const onBan = async (
  Bots: BotsProps,
  channel: string,
  username: string,
  _reason: string
) => {
  logEvent({
    Bots,
    type: LogEventType.Leave,
    description: `${username} has been banned from ${channel}!`,
  });

  await Bots.db
    ?.collection(Bots.env.MONGODB_USERS)
    .findOneAndDelete({ username })
    .then(() => {
      logEvent({
        Bots,
        type: LogEventType.Deleted,
        description: `Record with username=${username} has been removed from collection ${Bots.env.MONGODB_USERS}.`,
        footer: `Twitch Username: ${username}`,
      });
    })
    .catch(() => {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Error deleting record with username=${username} from collection ${Bots.env.MONGODB_USERS}.`,
        footer: `Twitch Username: ${username}`,
      });
    });
};
