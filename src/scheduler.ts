import cron from 'node-cron';

import { CONFIG } from '@/constants';
import { sendServerGreeting, updateBotActivity } from '@/discord/helpers';
import { BotState } from '@/interfaces/bot';
import { updatePetStatus } from '@/services/pet';

export const scheduleTasks = (state: BotState) => {
  if (CONFIG.FEATURES.PET.ENABLED) {
    // update the pet every 15 minutes
    state.timers.push(
      cron.schedule('*/15 * * * *', async () => {
        await updatePetStatus();
      })
    );
  }

  // update the Discord bot activity every 30 minutes
  state.timers.push(
    cron.schedule('*/30 * * * *', async () => {
      await updateBotActivity(state);
    })
  );

  // send a daily message every 7:00 AM
  state.timers.push(
    cron.schedule('0 7 * * *', async () => {
      await sendServerGreeting();
    })
  );

  console.log('🦉 Little Owl: Scheduled Tasks Added');
};
