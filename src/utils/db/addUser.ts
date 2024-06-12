import { BotsProps } from 'src/interfaces';
import { UserObject } from 'src/schemas';

import { LogEventType } from '../../enums';
import { logEvent } from '../logEvent';

export const addUser = async (Bots: BotsProps, data: UserObject) => {
  try {
    await Bots.db?.collection(Bots.env.MONGODB_USERS).insertOne(data);
  } catch (err) {
    logEvent({
      Bots,
      type: LogEventType.Error,
      description: `Database Error (addUser): ` + JSON.stringify(err),
    });
    console.error(err);
  }
};
