import { Client } from 'tmi.js';

export const onJoin = (
  _Bot: Client,
  _channel: string,
  username: string,
  self: boolean
) => {
  if (self) return console.log('* littleowlbot is online *');
  // TODO: Log this event on private server
  console.log(`${username} has joined the chat.`);
};
