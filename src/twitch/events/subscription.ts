import { Client } from 'tmi.js';
import { ObjectProps } from 'src/constants';

export const onSubscription = (
  _Bot: Client,
  _channel: string,
  username: string,
  _methods: ObjectProps,
  message: string,
  _userstate: ObjectProps
) => {
  // TODO: Log this event on private server
  console.log(`${username} has subscribed to the channel! Message: ${message}`);
};
