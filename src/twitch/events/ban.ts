import { Client } from 'tmi.js';

export const onBan = (
  _Bot: Client,
  channel: string,
  username: string,
  _reason: string
) => {
  // TODO: Remove user information from the database
  // TODO: Log this event on private server
  console.log(`${username} has been banned from ${channel}!`);
};
