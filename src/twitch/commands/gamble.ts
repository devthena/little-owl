import { BotsProps, UserProps } from 'src/interfaces';
import { CONFIG } from '../../constants';
import { weightedRandom } from '../../utils';

// @todo: add error handling for await statements

export const onGamble = async (
  Bots: BotsProps,
  channel: string,
  user: UserProps,
  args: string[]
) => {
  if (!CONFIG.GAMES.GAMBLE.ENABLED) return;

  const replies = {
    invalidInput: `${user.twitch_username} enter a specific amount, 'all', or 'half'.`,
    invalidNegative: `${user.twitch_username} you should gamble at least 1 ${CONFIG.CURRENCY.SINGLE}.`,
    lostAll: `${user.twitch_username} lost all of their ${CONFIG.CURRENCY.PLURAL}. :money_with_wings:`,
    noPoints: `${user.twitch_username} you have no ${CONFIG.CURRENCY.SINGLE} to gamble.`,
    notEnough: `${user.twitch_username} you don't have that much ${CONFIG.CURRENCY.PLURAL} to gamble.`,
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
    win: CONFIG.GAMES.GAMBLE.WIN_PERCENT / 100,
    loss: 1 - CONFIG.GAMES.GAMBLE.WIN_PERCENT / 100,
  };

  let points = user.cash;
  const result = weightedRandom(probability);

  if (value === 'all') {
    if (result === 'win') {
      points += user.cash;
      Bots.twitch.say(
        channel,
        `${user.twitch_username} won ${user.cash} ${CONFIG.CURRENCY.PLURAL}! :moneybag:`
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
        `${user.twitch_username} won ${halfPoints} ${CONFIG.CURRENCY.PLURAL}! :moneybag:`
      );
    } else {
      points -= halfPoints;
      Bots.twitch.say(
        channel,
        `${user.twitch_username} lost ${halfPoints} ${CONFIG.CURRENCY.PLURAL}. :money_with_wings:`
      );
    }
  } else if (amount <= user.cash) {
    if (result === 'win') {
      points += amount;
      Bots.twitch.say(
        channel,
        `${user.twitch_username} won ${amount} ${CONFIG.CURRENCY.PLURAL}! :moneybag:`
      );
    } else {
      points -= amount;
      Bots.twitch.say(
        channel,
        `${user.twitch_username} lost ${amount} ${CONFIG.CURRENCY.PLURAL}. :money_with_wings:`
      );
    }
  } else if (amount > user.cash) {
    Bots.twitch.say(channel, replies.notEnough);
    return;
  }

  await Bots.db
    ?.collection(Bots.env.MONGODB_USERS)
    .updateOne({ twitch_id: user.twitch_id }, { $set: { cash: points } });
};
