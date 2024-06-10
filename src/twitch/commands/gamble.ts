import { BotsProps } from 'src/interfaces';
import { UserObject } from 'src/schemas';
import { GAMBLE } from '../../configs';
import { CURRENCY, TWITCH_GAMBLE_EMOTES } from '../../constants';
import { LogEventType } from '../../enums';
import { logEvent, weightedRandom } from '../../utils';

export const onGamble = async (
  Bots: BotsProps,
  channel: string,
  user: UserObject,
  args: string[]
) => {
  if (!GAMBLE.ENABLED) return;

  const replies = {
    lostAll: `${user.twitch_username} lost all of their ${CURRENCY.PLURAL}. ${TWITCH_GAMBLE_EMOTES.LOST}`,
    noPoints: `${user.twitch_username} you have no ${CURRENCY.SINGLE} to gamble.`,
    notEnough: `${user.twitch_username} you don't have enough ${CURRENCY.PLURAL} to gamble.`,
  };

  if (user.cash < 1) {
    Bots.twitch.say(channel, replies.noPoints);
    return;
  }

  const value = args[0];
  const amount = parseInt(value, 10);

  if (isNaN(amount) && value !== 'all' && value !== 'half') return;
  if (amount < 1) return;

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
        `${user.twitch_username} won ${user.cash} ${CURRENCY.PLURAL}! ${TWITCH_GAMBLE_EMOTES.WIN} Your cash balance: ${points}`
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
        `${user.twitch_username} won ${halfPoints} ${CURRENCY.PLURAL}! ${TWITCH_GAMBLE_EMOTES.WIN} Your cash balance: ${points}`
      );
    } else {
      points -= halfPoints;
      Bots.twitch.say(
        channel,
        `${user.twitch_username} lost ${halfPoints} ${CURRENCY.PLURAL}. ${TWITCH_GAMBLE_EMOTES.LOST} Your cash balance: ${points}`
      );
    }
  } else if (amount <= user.cash) {
    if (result === 'win') {
      points += amount;
      Bots.twitch.say(
        channel,
        `${user.twitch_username} won ${amount} ${CURRENCY.PLURAL}! ${TWITCH_GAMBLE_EMOTES.WIN} Your cash balance: ${points}`
      );
    } else {
      points -= amount;
      Bots.twitch.say(
        channel,
        `${user.twitch_username} lost ${amount} ${CURRENCY.PLURAL}. ${TWITCH_GAMBLE_EMOTES.LOST} Your cash balance: ${points}`
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
