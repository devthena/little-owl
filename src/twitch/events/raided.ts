import { Client } from 'tmi.js';

export const onRaided = (
  _Bot: Client,
  _channel: string,
  username: string,
  viewers: number
) => {
  // TODO: Log this event on private server
  console.log(`${username} is raiding the chat with ${viewers} viewers!`);
};
