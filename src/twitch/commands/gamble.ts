import { BotsProps, TwitchUserProps } from 'src/interfaces';
import { CONFIG } from '../../constants';
import { weightedRandom } from '../../utils';

export const onGamble = async (
  Bots: BotsProps,
  channel: string,
  user: TwitchUserProps,
  args: Array<string>
) => {
  if (!CONFIG.GAMES.GAMBLE.ENABLED) return;

  const replies = {
    invalidInput: `${user.username} enter a specific amount, 'all', or 'half'.`,
    invalidNegative: `${user.username} you should gamble at least 1 ${CONFIG.CURRENCY.SINGLE}.`,
    lostAll: `${user.username} lost all of their ${CONFIG.CURRENCY.PLURAL}. :money_with_wings:`,
    noPoints: `${user.username} you have no ${CONFIG.CURRENCY.SINGLE} to gamble.`,
    notEnough: `${user.username} you don't have that much ${CONFIG.CURRENCY.PLURAL} to gamble.`,
  };

  if (user.points < 1) {
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

  let updates = { points: user.points };
  const result = weightedRandom(probability);

  if (value === 'all') {
    if (result === 'win') {
      updates.points += user.points;
      Bots.twitch.say(
        channel,
        `${user.username} won ${user.points} ${CONFIG.CURRENCY.PLURAL}! :moneybag:`
      );
    } else {
      updates.points = 0;
      Bots.twitch.say(channel, replies.lostAll);
    }
  } else if (value === 'half') {
    const halfPoints = Math.round(user.points / 2);

    if (result === 'win') {
      updates.points += halfPoints;
      Bots.twitch.say(
        channel,
        `${user.username} won ${halfPoints} ${CONFIG.CURRENCY.PLURAL}! :moneybag:`
      );
    } else {
      updates.points -= halfPoints;
      Bots.twitch.say(
        channel,
        `${user.username} lost ${halfPoints} ${CONFIG.CURRENCY.PLURAL}. :money_with_wings:`
      );
    }
  } else if (amount <= user.points) {
    if (result === 'win') {
      updates.points += amount;
      Bots.twitch.say(
        channel,
        `${user.username} won ${amount} ${CONFIG.CURRENCY.PLURAL}! :moneybag:`
      );
    } else {
      updates.points -= amount;
      Bots.twitch.say(
        channel,
        `${user.username} lost ${amount} ${CONFIG.CURRENCY.PLURAL}. :money_with_wings:`
      );
    }
  } else if (amount > user.points) {
    Bots.twitch.say(channel, replies.notEnough);
    return;
  }

  await Bots.db
    ?.collection(Bots.env.MONGODB_CHAT)
    .updateOne(
      { twitch_id: user.twitch_id },
      { $set: { ...updates } },
      { upsert: true }
    );
};
