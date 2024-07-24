import { LogCode } from '@/enums/logs';
import { StatsDocument } from '@/interfaces/statistics';
import { StatsModel } from '@/models/statistics';

export const deleteStats = async (
  log: Function,
  id: string
): Promise<StatsDocument | null> => {
  try {
    const deleted = await StatsModel.findOneAndDelete({ discord_id: id });
    return deleted;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return null;
  }
};
