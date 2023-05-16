import { Client } from 'discord.js';
import { BOT_ACTIVITIES } from 'src/constants';

let timer: NodeJS.Timeout | null = null;
let pointer: number = 0;

export const discordBotTimer = (Bot: Client) => {
  if (pointer < BOT_ACTIVITIES.length) {
    const activityName = BOT_ACTIVITIES[pointer].name;
    const activityType = BOT_ACTIVITIES[pointer].type;

    Bot.user?.setActivity(activityName, {
      type: activityType,
    });

    pointer++;
    if (pointer >= BOT_ACTIVITIES.length) pointer = 0;
  }

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    discordBotTimer(Bot);
  }, 1800000);
};
