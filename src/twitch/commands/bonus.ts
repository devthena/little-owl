import { CONFIG } from '@/constants';
import { BotsProps } from '@/interfaces/bot';
import { UserDocument } from '@/interfaces/user';
import { getCurrency } from '@/lib';
import { incTwitchUser } from '@/services/user';

export const onBonus = async (
  Bots: BotsProps,
  channel: string,
  recipient: UserDocument,
  value: number
) => {
  if (!CONFIG.FEATURES.BONUS.ENABLED) return;

  if (recipient.twitch_id) {
    await incTwitchUser(Bots.log, recipient.twitch_id, { cash: value });

    Bots.twitch.say(
      channel,
      `${recipient.twitch_username} has received ${value} ${getCurrency(value)}`
    );
  }

  return;
};
