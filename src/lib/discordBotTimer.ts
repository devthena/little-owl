import { Client } from 'discord.js';
import { CONFIG } from '@/constants';

let timer: NodeJS.Timeout | null = null;
let pointer: number = 0;

export const discordBotTimer = (Bot: Client) => {
  if (pointer < CONFIG.ACTIVITIES.length) {
    const activityName = CONFIG.ACTIVITIES[pointer].name;
    const activityType = CONFIG.ACTIVITIES[pointer].type;

    Bot.user?.setActivity(activityName, {
      type: activityType,
    });

    pointer++;
    if (pointer >= CONFIG.ACTIVITIES.length) pointer = 0;
  }

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    discordBotTimer(Bot);
  }, 1800000);
};
