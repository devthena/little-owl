import cron from 'node-cron';

import { updateBotActivity } from '@/discord/helpers';
import { BotState } from '@/interfaces/bot';
import { updatePetStatus } from '@/services/pet';

export const scheduleTasks = (state: BotState) => {
  // update the pet every eight minutes
  cron.schedule('*/15 * * * *', async () => {
    await updatePetStatus();
  });

  // update the Discord bot activity
  cron.schedule('*/30 * * * *', async () => {
    await updateBotActivity(state);
  });
};
