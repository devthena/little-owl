import { v4 as uuidv4 } from 'uuid';

import { UserObject } from 'src/schemas';
import { BotsProps, ObjectProps } from 'src/types';

import { onGamble, onGive } from '../commands';
import { CONFIG, COPY, IGNORE_LIST, INITIAL, URLS } from '../../constants';
import { LogEventType } from '../../enums';
import { getCurrency, isNumber } from '../../lib';
import { addUser, getUserById, getUserByName } from '../../lib/db';

export const onChat = async (
  Bots: BotsProps,
  channel: string,
  userstate: ObjectProps,
  message: string,
  self: boolean
) => {
  if (self) return;
  if (IGNORE_LIST.includes(userstate.username)) return;

  const document = await getUserById(Bots, userstate['user-id'], true);

  const userData: UserObject = document ?? {
    ...INITIAL.USER,
    user_id: uuidv4(),
    twitch_id: userstate['user-id'],
    twitch_username: userstate.username,
  };

  if (!document) await addUser(Bots, userData);

  const redeemId = userstate['custom-reward-id'];

  if (redeemId) {
    let points = 0;

    switch (redeemId) {
      case CONFIG.TWITCH_REWARDS.REDEEM100:
        points = 100;
        break;
      case CONFIG.TWITCH_REWARDS.REDEEM500:
        points = 500;
        break;
      case CONFIG.TWITCH_REWARDS.REDEEM1K:
        points = 1000;
        break;
    }

    if (!points) return;

    Bots.twitch.say(
      channel,
      `${userstate.username} has redeemed ${points} ${CONFIG.CURRENCY.PLURAL}!`
    );

    Bots.log({
      type: LogEventType.Activity,
      description: `${userstate.username} has redeemed conversion of ${
        points * 10
      } channel points to ${points} ${CONFIG.CURRENCY.PLURAL}!`,
    });

    try {
      await Bots.db
        ?.collection(Bots.env.MONGODB_USERS)
        .updateOne(
          { twitch_id: userstate['user-id'] },
          { $inc: { cash: points } }
        );
    } catch (error) {
      Bots.log({
        type: LogEventType.Error,
        description: `Twitch Database Error (Chat): ` + JSON.stringify(error),
      });
    }

    return;
  }

  if (message.startsWith('!')) {
    const args = message.slice(1).split(' ');
    const command = args.shift()?.toLowerCase();

    // commands that do not expect an argument

    if (command === COPY.COMMANDS.NAME) {
      return Bots.twitch.say(channel, URLS.COMMANDS);
    }

    if (command === COPY.POINTS.NAME) {
      return Bots.twitch.say(
        channel,
        `${userstate.username} you have ${userData.cash} ${getCurrency(
          userData.cash
        )}`
      );
    }

    // commands that expect at least one (1) argument

    if (command === COPY.GAMBLE.NAME) {
      return onGamble(Bots, channel, userData, args);
    }

    // commands that expect a recipient in the argument

    const recipient = args[0].slice(0, 1) === '@' ? args[0].slice(1) : null;

    if (!recipient) return;

    const amount = args[1];

    if (!isNumber(amount)) return;

    const value = parseInt(args[1], 10);

    if (value < 1) return;

    const recipientData = await getUserByName(Bots, recipient, true);

    if (!recipientData) return;

    if (command === COPY.GIVE.NAME) {
      return onGive(Bots, channel, userData, recipientData, value);
    }
  }

  const words = message.split(/ +/g);
  const pattern = /[A-Za-z].{2,}/;

  const isValid = words.length > 2 && words.some(word => pattern.test(word));

  // @todo: Add logic to detect spam messages

  if (!isValid) return;

  try {
    await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .updateOne({ twitch_id: userstate['user-id'] }, { $inc: { cash: 1 } });
  } catch (error) {
    Bots.log({
      type: LogEventType.Error,
      description: `Twitch Database Error (Chat): ` + JSON.stringify(error),
    });
  }
};
