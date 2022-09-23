import { CONFIG } from '../../constants';
import { BotsProps, ObjectProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onChat = (
  Bots: BotsProps,
  channel: string,
  userstate: ObjectProps,
  message: string,
  self: boolean
) => {
  if (self) return;

  const redeemId = userstate['custom-reward-id'];

  if (redeemId) {
    let points = 0;

    switch (redeemId) {
      case CONFIG.REWARDS.CONVERT100:
        // TODO: Update user's balance with additional 100 drachmai
        points = 100;
        break;
      case CONFIG.REWARDS.CONVERT500:
        // TODO: Update user's balance with additional 500 drachmai
        points = 500;
        break;
      case CONFIG.REWARDS.CONVERT1000:
        // TODO: Update user's balance with additional 1000 drachmai
        points = 1000;
        break;
    }

    if (!points) return;

    Bots.twitch.say(
      channel,
      `${userstate.username} has redeemed ${points} ${CONFIG.CURRENCY.PLURAL}!`
    );

    return logEvent(
      Bots.discord,
      'activity',
      `${userstate.username} has redeemed conversion of ${
        points * 10
      } channel points to ${points} ${CONFIG.CURRENCY.PLURAL}!`
    );
  }

  // TODO: Implement custom commands for the bot
  if (message.startsWith(CONFIG.PREFIX)) {
    return;
  }

  const words = message.split(/ +/g);
  const pattern = new RegExp('[A-Za-z].{2,}');

  const isValid = words.length > 2 && words.some(word => pattern.test(word));

  // TODO: Add logic to detect spam messages

  if (!isValid) return;

  // TODO: Get user from the database then add 1 drachma to their balance
};
