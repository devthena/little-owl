import { CONFIG } from '@/constants';
import { BotState } from '@/interfaces/bot';
import { discord } from '@/lib/clients';

export const updateBotActivity = (state: BotState) => {
  if (state.activity < CONFIG.ACTIVITIES.length) {
    discord.user?.setActivity(CONFIG.ACTIVITIES[state.activity]);
    state.activity += 1;
    if (state.activity >= CONFIG.ACTIVITIES.length) state.activity = 0;
  }
};
