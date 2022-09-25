import { BotsProps, ObjectProps, TwitchUserProps } from 'src/interfaces';
import { CONFIG } from '../../constants';
import { logEvent } from '../../utils';
import { onGamble } from '../commands';

export const onChat = async (
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
        points = 100;
        break;
      case CONFIG.REWARDS.CONVERT500:
        points = 500;
        break;
      case CONFIG.REWARDS.CONVERT1000:
        points = 1000;
        break;
    }

    if (!points) return;

    Bots.twitch.say(
      channel,
      `${userstate.username} has redeemed ${points} ${CONFIG.CURRENCY.PLURAL}!`
    );

    logEvent(
      Bots.discord,
      'activity',
      `${userstate.username} has redeemed conversion of ${
        points * 10
      } channel points to ${points} ${CONFIG.CURRENCY.PLURAL}!`
    );

    if (process.env.MONGODB_CHAT) {
      await Bots.db?.collection(process.env.MONGODB_CHAT).updateOne(
        { twitch_id: userstate['user-id'] },
        {
          $set: {
            username: userstate.username,
          },
          $inc: {
            points: points,
          },
        },
        { upsert: true }
      );
    }

    return;
  }

  // TODO: Implement custom commands for the bot
  if (message.startsWith(CONFIG.PREFIX)) {
    const args = message.slice(1).split(' ');
    const command = args.shift()?.toLowerCase();

    if (process.env.MONGODB_CHAT) {
      const document = await Bots.db
        ?.collection(process.env.MONGODB_CHAT)
        .findOne({ twitch_id: userstate['user-id'] });

      const data: TwitchUserProps = {
        twitch_id: userstate['user-id'],
        username: userstate.username,
        points: document ? document.points : 0,
      };

      if (command === 'gamble') {
        onGamble(Bots, channel, data, args);
      } else if (command === 'points') {
        Bots.twitch.say(
          channel,
          `${userstate.username} you have ${data.points} ${
            data.points > 1 ? CONFIG.CURRENCY.PLURAL : CONFIG.CURRENCY.SINGLE
          }.`
        );
      }
    }

    return;
  }

  const words = message.split(/ +/g);
  const pattern = new RegExp('[A-Za-z].{2,}');

  const isValid = words.length > 2 && words.some(word => pattern.test(word));

  // TODO: Add logic to detect spam messages

  if (!isValid) return;

  if (process.env.MONGODB_CHAT) {
    await Bots.db?.collection(process.env.MONGODB_CHAT).updateOne(
      { twitch_id: userstate['user-id'] },
      {
        $set: {
          username: userstate.username,
          last_chat: message,
        },
        $inc: {
          points: 1,
        },
      },
      { upsert: true }
    );
  }
};
