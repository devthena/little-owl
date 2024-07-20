import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';
import { removeStats } from '@/models/statistics';

export const deleteStats = async (Bots: BotsProps, id: string) => {
  try {
    await removeStats(Bots, id);
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};
