import { Client } from 'tmi.js';
import { ObjectProps } from 'src/constants';

export const onSubGift = (
  _Bot: Client,
  _channel: string,
  username: string,
  _streakMonths: number,
  recipient: string,
  _methods: ObjectProps,
  _userstate: ObjectProps
) => {
  // TODO: Add logic for variations of subgift events
  // TODO: Log this event on private server
  console.log(`${username} gifted a subscription to ${recipient}!`);
};
