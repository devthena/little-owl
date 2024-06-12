import { v4 as uuidv4 } from 'uuid';
import { BotsProps, ObjectProps } from 'src/interfaces';
import { UserObject } from 'src/schemas';
import { CURRENCY, IGNORE_LIST, NEW_USER } from '../../constants';
import {
  LogEventType,
  ParthenonURL,
  TwitchChannelRewardId,
  TwitchCommandName,
} from '../../enums';
import { logEvent } from '../../utils';
import { getUserById, getUserByName } from '../../utils/db';
import { onGamble, onGive } from '../commands';

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
    ...NEW_USER,
    user_id: uuidv4(),
    twitch_id: userstate['user-id'],
    twitch_username: userstate.username,
  };

  if (!document) {
    try {
      await Bots.db?.collection(Bots.env.MONGODB_USERS).insertOne(userData);
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Twitch Database Error (Chat): ` + JSON.stringify(err),
      });
      console.error(err);
    }
  }

  const redeemId = userstate['custom-reward-id'];

  if (redeemId) {
    let points = 0;

    switch (redeemId) {
      case TwitchChannelRewardId.Convert100:
        points = 100;
        break;
      case TwitchChannelRewardId.Convert500:
        points = 500;
        break;
      case TwitchChannelRewardId.Convert1k:
        points = 1000;
        break;
    }

    if (!points) return;

    Bots.twitch.say(
      channel,
      `${userstate.username} has redeemed ${points} ${CURRENCY.PLURAL}!`
    );

    logEvent({
      Bots,
      type: LogEventType.Activity,
      description: `${userstate.username} has redeemed conversion of ${
        points * 10
      } channel points to ${points} ${CURRENCY.PLURAL}!`,
    });

    try {
      await Bots.db
        ?.collection(Bots.env.MONGODB_USERS)
        .updateOne(
          { twitch_id: userstate['user-id'] },
          { $inc: { cash: points } }
        );
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Twitch Database Error (Chat): ` + JSON.stringify(err),
      });
      console.error(err);
    }

    return;
  }

  if (message.startsWith('!')) {
    const args = message.slice(1).split(' ');
    const command = args.shift()?.toLowerCase();

    // commands that do not expect an argument

    if (command === TwitchCommandName.Commands) {
      return Bots.twitch.say(channel, ParthenonURL.Commands);
    }

    if (command === TwitchCommandName.Points) {
      return Bots.twitch.say(
        channel,
        `${userstate.username} you have ${userData.cash} ${
          userData.cash > 1 ? CURRENCY.PLURAL : CURRENCY.SINGLE
        }`
      );
    }

    // commands that expect at least one (1) argument

    if (command === TwitchCommandName.Gamble) {
      return onGamble(Bots, channel, userData, args);
    }

    // commands that expect a recipient in the argument

    const recipient = args[0].slice(0, 1) === '@' ? args[0].slice(1) : null;
    const value = parseInt(args[1], 10);

    if (!recipient) return;
    if (isNaN(value)) return;

    const recipientData = await getUserByName(Bots, recipient, true);

    if (!recipientData) return;

    if (command === TwitchCommandName.Give) {
      return onGive(Bots, channel, userData, recipientData, value);
    }
  }

  const words = message.split(/ +/g);
  const pattern = new RegExp('[A-Za-z].{2,}');

  const isValid = words.length > 2 && words.some(word => pattern.test(word));

  // @todo: Add logic to detect spam messages

  if (!isValid) return;

  try {
    await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .updateOne({ twitch_id: userstate['user-id'] }, { $inc: { cash: 1 } });
  } catch (err) {
    logEvent({
      Bots,
      type: LogEventType.Error,
      description: `Twitch Database Error (Chat): ` + JSON.stringify(err),
    });
    console.error(err);
  }
};
