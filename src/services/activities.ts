import { log } from '@/discord/helpers';
import { LogCode } from '@/enums/logs';
import { ActivityDocument, StarActivity } from '@/interfaces/activities';
import { ActivityModel } from '@/models/activities';

export const deleteActivity = async (
  id: string
): Promise<ActivityDocument | null> => {
  try {
    const deleted = await ActivityModel.findOneAndDelete({ discord_id: id });
    return deleted;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return null;
  }
};

export const findOrCreateStarActivity = async (
  id: string
): Promise<StarActivity | null> => {
  try {
    const activity = await ActivityModel.findOne(
      { discord_id: id },
      { star: 1 }
    ).exec();

    if (activity) {
      if (!activity.star) {
        activity.star = {
          last_given: '',
          total_given: 0,
        };

        await activity.save();
      }
      return activity.star;
    }

    const newActivity = new ActivityModel({
      discord_id: id,
      star: {
        last_given: '',
        total_given: 0,
      },
    });

    await newActivity.save();
    return newActivity.star ?? null;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return null;
  }
};

export const updateStarActivity = async (
  id: string
): Promise<ActivityDocument | null> => {
  try {
    const activity = await ActivityModel.findOneAndUpdate(
      { discord_id: id },
      {
        $inc: { 'star.total_given': 1 },
        $set: { 'star.last_given': new Date().toDateString() },
      }
    ).exec();
    return activity;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return null;
  }
};
