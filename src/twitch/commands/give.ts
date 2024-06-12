import { BotsProps } from 'src/interfaces';
import { UserObject } from 'src/schemas';
import { GIVE } from '../../configs';
import { CURRENCY } from '../../constants';
import { LogEventType } from '../../enums';
import { getCurrency, logEvent } from '../../utils';

export const onGive = async (
  Bots: BotsProps,
  channel: string,
  user: UserObject,
  recipient: UserObject,
  value: number
) => {
  if (!GIVE.ENABLED) return;

  const replies = {
    noPoints: `${user.twitch_username} you have no ${CURRENCY.SINGLE} to give.`,
    notEnough: `${user.twitch_username} you don't have that much ${CURRENCY.PLURAL} to give.`,
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
  } catch (err) {
    logEvent({
      Bots,
      type: LogEventType.Error,
      description: `Twitch Database Error (Give): ` + JSON.stringify(err),
    });
    console.error(err);
  }

  return;
};
