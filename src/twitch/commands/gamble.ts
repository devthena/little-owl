import { BotsProps, UserProps } from 'src/interfaces';
import { GAMBLE } from '../../configs';
import { CURRENCY } from '../../constants';
import { LogEventType } from '../../enums';
import { logEvent, weightedRandom } from '../../utils';

export const onGamble = async (
  Bots: BotsProps,
  channel: string,
  user: UserProps,
  args: string[]
) => {
  if (!GAMBLE.ENABLED) return;

  const replies = {
    invalidInput: `${user.twitch_username} enter a specific amount, 'all', or 'half'.`,
    invalidNegative: `${user.twitch_username} you should gamble at least 1 ${CURRENCY.SINGLE}`,
    lostAll: `${user.twitch_username} lost all of their ${CURRENCY.PLURAL}. :money_with_wings:`,
    noPoints: `${user.twitch_username} you have no ${CURRENCY.SINGLE} to gamble.`,
    notEnough: `${user.twitch_username} you don't have that much ${CURRENCY.PLURAL} to gamble.`,
  };

  if (user.cash < 1) {
    Bots.twitch.say(channel, replies.noPoints);
    return;
  }

  const value = args[0];
  const amount = parseInt(value, 10);

  if (isNaN(amount) && value !== 'all' && value !== 'half') {
    Bots.twitch.say(channel, replies.invalidInput);
    return;
  }

  if (amount < 1) {
    Bots.twitch.say(channel, replies.invalidNegative);
    return;
  }

  const probability = {
    win: GAMBLE.WIN_PERCENT / 100,
    loss: 1 - GAMBLE.WIN_PERCENT / 100,
  };

  let points = user.cash;
  const result = weightedRandom(probability);

  if (value === 'all') {
    if (result === 'win') {
      points += user.cash;
      Bots.twitch.say(
        channel,
        `${user.twitch_username} won ${user.cash} ${CURRENCY.PLURAL}! :moneybag: Your cash balance: ${points}`
      );
    } else {
      points = 0;
      Bots.twitch.say(channel, replies.lostAll);
    }
  } else if (value === 'half') {
    const halfPoints = Math.round(user.cash / 2);

    if (result === 'win') {
      points += halfPoints;
      Bots.twitch.say(
        channel,
        `${user.twitch_username} won ${halfPoints} ${CURRENCY.PLURAL}! :moneybag: Your cash balance: ${points}`
      );
    } else {
      points -= halfPoints;
      Bots.twitch.say(
        channel,
        `${user.twitch_username} lost ${halfPoints} ${CURRENCY.PLURAL}. :money_with_wings: Your cash balance: ${points}`
      );
    }
  } else if (amount <= user.cash) {
    if (result === 'win') {
      points += amount;
      Bots.twitch.say(
        channel,
        `${user.twitch_username} won ${amount} ${CURRENCY.PLURAL}! :moneybag: Your cash balance: ${points}`
      );
    } else {
      points -= amount;
      Bots.twitch.say(
        channel,
        `${user.twitch_username} lost ${amount} ${CURRENCY.PLURAL}. :money_with_wings: Your cash balance: ${points}`
      );
    }
  } else if (amount > user.cash) {
    Bots.twitch.say(channel, replies.notEnough);
    return;
  }

  try {
    await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .updateOne({ twitch_id: user.twitch_id }, { $set: { cash: points } });
  } catch (err) {
    logEvent({
      Bots,
      type: LogEventType.Error,
      description: `Twitch Database Error (Gamble): ` + JSON.stringify(err),
    });
    console.error(err);
  }
};
