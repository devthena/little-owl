import { ActivityDocument, ActivityPayload } from '@/interfaces/activities';
import { BotsProps } from '@/interfaces/bot';

export const addActivity = async (
  Bots: BotsProps,
  id: string,
  data: ActivityPayload
) => {
  await Bots.db?.collection(Bots.env.MONGODB_ACTS).insertOne({
    discord_id: id,
    ...data,
  });
};

export const getActivity = async (
  Bots: BotsProps,
  id: string
): Promise<ActivityDocument | null | undefined> => {
  return await Bots.db
    ?.collection<ActivityDocument>(Bots.env.MONGODB_ACTS)
    .findOne({
      discord_id: id,
    });
};

export const removeActivity = async (Bots: BotsProps, id: string) => {
  await Bots.db?.collection(Bots.env.MONGODB_ACTS).deleteOne({
    discord_id: id,
  });
};

export const setStarActivity = async (
  Bots: BotsProps,
  id: string,
  date: string
) => {
  await Bots.db?.collection(Bots.env.MONGODB_ACTS).updateOne(
    { discord_id: id },
    {
      $inc: { 'star.total_given': 1 },
      $set: { 'star.last_given': date },
    }
  );
};
