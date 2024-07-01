import { UserObject } from 'src/schemas';
import { BotsProps } from 'src/types';

import { LogEventType } from '../../enums';
import { logEvent } from '../logEvent';

export const getUserById = async (
  Bots: BotsProps,
  id: string,
  isTwitch: boolean = false
): Promise<UserObject | undefined> => {
  try {
    const idField = isTwitch ? 'twitch_id' : 'discord_id';

    const document = await Bots.db
      ?.collection<UserObject>(Bots.env.MONGODB_USERS)
      .findOne({ [idField]: id });

    return document ?? undefined;
  } catch (error) {
    logEvent({
      Bots,
      type: LogEventType.Error,
      description: `Database Error (getUserById): ` + JSON.stringify(error),
    });
    return;
  }
};
