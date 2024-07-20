import { BotsProps } from '@/interfaces/bot';

export const removeStats = async (Bots: BotsProps, id: string) => {
  await Bots.db?.collection(Bots.env.MONGODB_STATS).deleteOne({
    discord_id: id,
  });
};
