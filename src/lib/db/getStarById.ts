import { StarObject } from 'src/schemas';
import { BotsProps } from 'src/types';

import { LogEventType } from '../../enums';

export const getStarById = async (
  Bots: BotsProps,
  id: string
): Promise<StarObject | undefined> => {
  try {
    const document = await Bots.db
      ?.collection<StarObject>(Bots.env.MONGODB_STARS)
      .findOne({ discord_id: id });

    return document ?? undefined;
  } catch (error) {
    Bots.log({
      type: LogEventType.Error,
      description: `Database Error (getStarById): ` + JSON.stringify(error),
    });
    return;
  }
};
