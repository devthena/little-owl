import { ActivityType, Client } from 'discord.js';
import { BOT_ACTIVITIES, BOT_CONFIG } from '../discord/constants';

let timer: NodeJS.Timeout | null = null;
let pointer: number = 0;

export const discordBotTimer = (Bot: Client) => {
  if (pointer < BOT_ACTIVITIES.length) {
    let activity = ActivityType.Playing;

    if (BOT_ACTIVITIES[pointer].type == 2) activity = ActivityType.Listening;
    else if (BOT_ACTIVITIES[pointer].type == 3)
      activity = ActivityType.Watching;

    Bot.user?.setActivity(BOT_ACTIVITIES[pointer].name, {
      type: activity,
    });

    pointer++;
    if (pointer >= BOT_ACTIVITIES.length) pointer = 0;
  }

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    discordBotTimer(Bot);
  }, BOT_CONFIG.POLL_RATE_MS);
};
