import { BotsProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onBan = async (
  Bots: BotsProps,
  channel: string,
  username: string,
  _reason: string
) => {
  // TODO: Remove user information from the database
  logEvent({
    Bots,
    type: 'leave',
    description: `${username} has been banned from ${channel}!`,
  });

  await Bots.db
    ?.collection(Bots.env.MONGODB_USERS)
    .findOneAndDelete({ username })
    .then(() => {
      logEvent({
        Bots,
        type: 'delete',
        description: `Record with username=${username} has been removed from collection ${Bots.env.MONGODB_USERS}.`,
        footer: `Twitch Username: ${username}`,
      });
    })
    .catch(() => {
      logEvent({
        Bots,
        type: 'error',
        description: `Error deleting record with username=${username} from collection ${Bots.env.MONGODB_USERS}.`,
        footer: `Twitch Username: ${username}`,
      });
    });
};
