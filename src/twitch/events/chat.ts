import { BotsProps, ObjectProps } from 'src/constants';
import { CUSTOM_REWARDS } from '../constants';
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
    let drachmae = 0;

    switch (redeemId) {
      case CUSTOM_REWARDS.CONVERT100:
        // TODO: Update user's balance with additional 100 drachmae
        drachmae = 100;
        break;
      case CUSTOM_REWARDS.CONVERT500:
        // TODO: Update user's balance with additional 500 drachmae
        drachmae = 500;
        break;
      case CUSTOM_REWARDS.CONVERT1000:
        // TODO: Update user's balance with additional 1000 drachmae
        drachmae = 1000;
        break;
    }

    if (!drachmae) return;

    Bots.twitch.say(
      channel,
      `${userstate.username} has redeemed ${drachmae} drachmae!`
    );

    return logEvent(
      Bots.discord,
      'activity',
      `${userstate.username} has redeemed conversion of ${
        drachmae * 10
      } channel points to ${drachmae} drachmae`
    );
  }

  // TODO: Implement custom commands for the bot
  console.log(message);
};
