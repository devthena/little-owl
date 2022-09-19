import { Client } from 'tmi.js';

export const onMessage = (
  Bot: Client,
  channel: string,
  userstate: object,
  message: string,
  self: boolean
) => {
  if (self) return;

  // TODO: Implement custom commands for the bot
  console.log(Bot, channel, userstate, message);
};
