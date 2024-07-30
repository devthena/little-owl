import cron from 'node-cron';

import { BotsProps } from '@/interfaces/bot';
import { updatePetStatus } from '@/services/pet';

export const scheduleTasks = (Bots: BotsProps) => {
  // update the pet every eight minutes
  cron.schedule('*/15 * * * *', async () => {
    await updatePetStatus(Bots.log);
  });
};
