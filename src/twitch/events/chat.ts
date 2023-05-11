import { v4 as uuidv4 } from 'uuid';
import { BotsProps, ObjectProps, UserProps } from 'src/interfaces';
import { CONFIG } from '../../constants';
import { UserModel } from '../../schemas';
import { logEvent } from '../../utils';
import { onGamble } from '../commands';
import { COMMAND_NAMES_TWITCH } from '../commands/constants';

// @todo: add error handling for await statements

export const onChat = async (
  Bots: BotsProps,
  channel: string,
  userstate: ObjectProps,
  message: string,
  self: boolean
) => {
  if (self) return;

  const document = await Bots.db
    ?.collection(Bots.env.MONGODB_USERS)
    .findOne({ twitch_id: userstate['user-id'] });

  const userData: UserProps = document
    ? {
        user_id: document.user_id,
        twitch_id: document.twitch_id,
        twitch_username: document.twitch_username,
        discord_id: document.discord_id,
        discord_username: document.discord_username,
        accounts_linked: document.accounts_linked,
        cash: document.cash,
        bank: document.bank,
        stars: document.stars,
        power_ups: document.power_ups,
      }
    : {
        ...UserModel,
        user_id: uuidv4(),
        twitch_id: userstate['user-id'],
        twitch_username: userstate.username,
      };

  if (!document) {
    await Bots.db?.collection(Bots.env.MONGODB_USERS).insertOne(userData);
  }

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

    logEvent({
      Bots,
      type: 'activity',
      description: `${userstate.username} has redeemed conversion of ${
        points * 10
      } channel points to ${points} ${CONFIG.CURRENCY.PLURAL}!`,
    });

    await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .updateOne(
        { twitch_id: userstate['user-id'] },
        { $inc: { cash: points } }
      );

    return;
  }

  if (message.startsWith(CONFIG.PREFIX)) {
    const args = message.slice(1).split(' ');
    const command = args.shift()?.toLowerCase();

    if (command === COMMAND_NAMES_TWITCH.GAMBLE) {
      onGamble(Bots, channel, userData, args);
    } else if (command === COMMAND_NAMES_TWITCH.POINTS) {
      Bots.twitch.say(
        channel,
        `${userstate.username} you have ${userData.cash} ${
          userData.cash > 1 ? CONFIG.CURRENCY.PLURAL : CONFIG.CURRENCY.SINGLE
        }.`
      );
    }

    return;
  }

  const words = message.split(/ +/g);
  const pattern = new RegExp('[A-Za-z].{2,}');

  const isValid = words.length > 2 && words.some(word => pattern.test(word));

  // @todo: Add logic to detect spam messages

  if (!isValid) return;

  await Bots.db
    ?.collection(Bots.env.MONGODB_USERS)
    .updateOne({ twitch_id: userstate['user-id'] }, { $inc: { cash: 1 } });
};
