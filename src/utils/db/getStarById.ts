import { BotsProps } from 'src/interfaces';
import { StarObject } from 'src/schemas';

import { LogEventType } from '../../enums';
import { logEvent } from '../logEvent';

export const getStarById = async (
  Bots: BotsProps,
  id: string
): Promise<StarObject | undefined> => {
  const document = await Bots.db
    ?.collection<StarObject>(Bots.env.MONGODB_STARS)
    .findOne({ discord_id: id })
    .catch(err => {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Database Error (getActivityById): ` + JSON.stringify(err),
      });
      console.error(err);
    });

  return document ?? undefined;
};
