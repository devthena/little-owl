import { CONFIG } from '@/constants';
import { UserDocument } from '@/interfaces/user';

import { twitch } from '@/lib/clients';
import { getCurrency } from '@/lib/utils';

import { incTwitchUser } from '@/services/user';

export const onBonus = async (
  channel: string,
  recipient: UserDocument,
  value: number
) => {
  if (!CONFIG.FEATURES.BONUS.ENABLED) return;

  if (recipient.twitch_id) {
    await incTwitchUser(recipient.twitch_id, { cash: value });

    twitch.say(
      channel,
      `${recipient.twitch_username} has received ${value} ${getCurrency(value)}`
    );
  }

  return;
};
