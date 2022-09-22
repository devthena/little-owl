import { Client } from 'tmi.js';
import { ObjectProps } from '../../constants';

export const onCheer = (
  _Bot: Client,
  _channel: string,
  userstate: ObjectProps,
  message: string
) => {
  // TODO: Log this event on private server
  console.log(
    `${userstate.username} cheered ${userstate.bits} in the chat! Message: ${message}`
  );
};
