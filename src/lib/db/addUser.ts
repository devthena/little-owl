import { LogEventType } from '@/enums';
import { UserObject } from '@/schemas';
import { BotsProps } from '@/types';

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
