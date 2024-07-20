import { CONFIG } from '@/constants';
import { UserObject } from '@/interfaces/user';
import { getCurrency } from '@/lib';
import { incTwitchUserCash, setTwitchUser } from '@/services/user';
import { BotsProps } from '@/types';

export const onGive = async (
  Bots: BotsProps,
  channel: string,
  user: UserObject,
  recipient: UserObject,
  value: number
) => {
  if (!CONFIG.FEATURES.GIVE.ENABLED) return;

  const replies = {
    noPoints: `${user.twitch_username} you have no ${CONFIG.CURRENCY.SINGLE} to give.`,
    notEnough: `${user.twitch_username} you don't have that much ${CONFIG.CURRENCY.PLURAL} to give.`,
    success: `${user.twitch_username} gave ${value} ${getCurrency(value)} to ${
      recipient.twitch_username
    }`,
  };

  if (user.cash < 1) return Bots.twitch.say(channel, replies.noPoints);
  if (user.cash < value) return Bots.twitch.say(channel, replies.notEnough);

  if (user.twitch_id && recipient.twitch_id) {
    await setTwitchUser(Bots, user.twitch_id, { cash: user.cash - value });
    await incTwitchUserCash(Bots, recipient.twitch_id, value);
  }

  return;
};
