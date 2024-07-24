import { ActivityCode } from '@/enums/activities';
import { LogCode } from '@/enums/logs';

import { ActivityObject, ActivityPayload } from '@/interfaces/activities';
import { BotsProps } from '@/interfaces/bot';

import {
  addActivity,
  getActivity,
  removeActivity,
  setStarActivity,
} from '@/models/activities';

export const deleteActivity = async (Bots: BotsProps, id: string) => {
  try {
    await removeActivity(Bots, id);
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const getActivityByCode = async (
  Bots: BotsProps,
  id: string,
  code: ActivityCode
): Promise<ActivityObject | null | undefined> => {
  const document = await getActivity(Bots, id);
  return document ? document[code] : null;
};

export const pushActivity = async (
  Bots: BotsProps,
  id: string,
  payload: ActivityPayload
) => {
  try {
    await addActivity(Bots, id, payload);
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const updateStarActivity = async (
  Bots: BotsProps,
  id: string,
  date: string
) => {
  try {
    await setStarActivity(Bots, id, date);
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};
