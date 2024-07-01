import { BotsProps } from 'src/types';

import { LogEventType } from '../../enums';
import { logEvent } from '../../utils';

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

  try {
    await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .findOneAndDelete({ twitch_username: username });

    logEvent({
      Bots,
      type: LogEventType.Deleted,
      description: `Record with username=${username} has been removed from collection ${Bots.env.MONGODB_USERS}.`,
      footer: `Twitch Username: ${username}`,
    });
  } catch (error) {
    const description = `Twitch Database Error (Ban):\nError deleting record with twitch_username=${username} from collection ${Bots.env.MONGODB_USERS}.`;

    logEvent({
      Bots,
      type: LogEventType.Error,
      description: description + `\n\nDetails:\n${JSON.stringify(error)}`,
    });
  }
};
