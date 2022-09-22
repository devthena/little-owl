import { Client } from 'tmi.js';
import { ObjectProps } from 'src/constants';

export const onTimeout = (
  _Bot: Client,
  _channel: string,
  username: string,
  reason: string,
  duration: number,
  _userstate: ObjectProps
) => {
  // TODO: Log this event on private server
  console.log(
    `${username} has been timed out for ${duration}s. Reason: ${reason}`
  );
};
