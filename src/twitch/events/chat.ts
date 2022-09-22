import { Client } from 'tmi.js';
import { ObjectProps } from '../../constants';

export const onChat = (
  _Bot: Client,
  _channel: string,
  userstate: ObjectProps,
  message: string,
  self: boolean
) => {
  if (self) return;

  // TODO: Implement custom commands for the bot
  console.log(userstate, message);
};
