import { StarObject } from 'src/schemas';
import { BotsProps } from 'src/types';

import { LogEventType } from '../../enums';

export const addStar = async (Bots: BotsProps, data: StarObject) => {
  try {
    await Bots.db?.collection(Bots.env.MONGODB_STARS).insertOne(data);
  } catch (error) {
    Bots.log({
      type: LogEventType.Error,
      description: `Database Error (addStar): ` + JSON.stringify(error),
    });
  }
};
