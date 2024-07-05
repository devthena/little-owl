import { UserObject } from 'src/schemas';
import { BotsProps } from 'src/types';

import { LogEventType } from '../../enums';

export const getUserByName = async (
  Bots: BotsProps,
  username: string,
  isTwitch: boolean = false
): Promise<UserObject | undefined> => {
  try {
    const nameField = isTwitch ? 'twitch_username' : 'discord_username';

    const document = await Bots.db
      ?.collection<UserObject>(Bots.env.MONGODB_USERS)
      .findOne({ [nameField]: username.toLowerCase() });

    return document ?? undefined;
  } catch (error) {
    Bots.log({
      type: LogEventType.Error,
      description: `Database Error (getUserByName): ` + JSON.stringify(error),
    });
    return;
  }
};
