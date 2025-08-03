import { COPY } from '@/constants';
import { BotState } from '@/interfaces/bot';
import { twitch } from '@/lib/clients';

export const chatReminder = (state: BotState) => {
  if (state.twitchChatQueue >= 11) {
    const channel = twitch.getChannels()[0];
    twitch.say(channel, COPY.TWITCH_REMINDERS[state.reminderIndex]);
    state.twitchChatQueue = 0;

    if (state.reminderIndex + 1 >= COPY.TWITCH_REMINDERS.length) {
      state.reminderIndex = 0;
    } else {
      state.reminderIndex += 1;
    }
  }
};
