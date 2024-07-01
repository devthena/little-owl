import { UserObject } from 'src/schemas';
import { BotsProps } from 'src/types';

import { LogEventType } from '../../enums';

export const addUser = async (Bots: BotsProps, data: UserObject) => {
  try {
    await Bots.db?.collection(Bots.env.MONGODB_USERS).insertOne(data);
  } catch (error) {
    Bots.log({
      type: LogEventType.Error,
      description: `Database Error (addUser): ` + JSON.stringify(error),
    });
  }
};
