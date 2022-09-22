import { Client } from 'tmi.js';

export const onPart = (
  _Bot: Client,
  _channel: string,
  username: string,
  _self: boolean
) => {
  // TODO: Log this event on private server
  console.log(`${username} has left the chat.`);
};
