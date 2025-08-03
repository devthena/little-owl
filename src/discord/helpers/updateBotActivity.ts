import { CONFIG } from '@/constants';
import { BotState } from '@/interfaces/bot';
import { discord } from '@/lib/clients';

export const updateBotActivity = (state: BotState) => {
  if (state.activityIndex < CONFIG.ACTIVITIES.length) {
    discord.user?.setActivity(CONFIG.ACTIVITIES[state.activityIndex]);
    state.activityIndex += 1;
    if (state.activityIndex >= CONFIG.ACTIVITIES.length)
      state.activityIndex = 0;
  }
};
