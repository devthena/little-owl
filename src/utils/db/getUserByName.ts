import { BotsProps } from 'src/interfaces';
import { UserObject } from 'src/schemas';

import { LogEventType } from '../../enums';
import { logEvent } from '../logEvent';

export const getUserByName = async (
  Bots: BotsProps,
  username: string,
  isTwitch: boolean = false
): Promise<UserObject | undefined> => {
  const nameField = isTwitch ? 'twitch_username' : 'discord_username';

  const document = await Bots.db
    ?.collection<UserObject>(Bots.env.MONGODB_USERS)
    .findOne({ [nameField]: username })
    .catch(err => {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Twitch Database Error (Chat): ` + JSON.stringify(err),
      });
      console.error(err);
    });

  return document ?? undefined;
};
