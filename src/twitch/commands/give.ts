import { UserObject } from 'src/schemas';
import { BotsProps } from 'src/types';

import { CONFIG } from '../../constants';
import { LogEventType } from '../../enums';
import { getCurrency } from '../../lib';

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

  try {
    await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .updateOne(
        { twitch_id: user.twitch_id },
        { $set: { cash: user.cash - value } }
      );

    await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .updateOne({ twitch_id: recipient.twitch_id }, { $inc: { cash: value } });

    Bots.twitch.say(channel, replies.success);
  } catch (error) {
    Bots.log({
      type: LogEventType.Error,
      description: `Twitch Database Error (Give): ` + JSON.stringify(error),
    });
  }

  return;
};
