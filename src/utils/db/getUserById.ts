import { BotsProps } from 'src/interfaces';
import { UserObject } from 'src/schemas';

import { LogEventType } from '../../enums';
import { logEvent } from '../logEvent';

export const getUserById = async (
  Bots: BotsProps,
  id: string,
  isTwitch: boolean = false
): Promise<UserObject | undefined> => {
  const idField = isTwitch ? 'twitch_id' : 'discord_id';

  const document = await Bots.db
    ?.collection<UserObject>(Bots.env.MONGODB_USERS)
    .findOne({ [idField]: id })
    .catch(err => {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Database Error (getUserById): ` + JSON.stringify(err),
      });
      console.error(err);
    });

  return document ?? undefined;
};
