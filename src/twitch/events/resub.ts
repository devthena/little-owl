import { Client } from 'tmi.js';
import { ObjectProps } from 'src/constants';

export const onResub = (
  _Bot: Client,
  _channel: string,
  username: string,
  _streakMonths: number,
  message: string,
  _userstate: ObjectProps,
  _methods: ObjectProps
) => {
  // TODO: Add logic for variations of resub event
  // TODO: Log this event on private server
  console.log(`${username} has resubbed to the channel! Message: ${message}`);
};
