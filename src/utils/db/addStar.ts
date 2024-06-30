import { BotsProps } from 'src/interfaces';
import { StarObject } from 'src/schemas';

import { LogEventType } from '../../enums';
import { logEvent } from '../logEvent';

export const addStar = async (Bots: BotsProps, data: StarObject) => {
  try {
    await Bots.db?.collection(Bots.env.MONGODB_STARS).insertOne(data);
  } catch (err) {
    logEvent({
      Bots,
      type: LogEventType.Error,
      description: `Database Error (addStar): ` + JSON.stringify(err),
    });
    console.error(err);
  }
};
