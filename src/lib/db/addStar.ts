import { LogEventType } from '@/enums';
import { StarObject } from '@/schemas';
import { BotsProps } from '@/types';

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
