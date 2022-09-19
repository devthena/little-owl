import { Client } from 'tmi.js';

export const onMessage = (
  Bot: Client,
  channel: string,
  tags: object,
  message: string,
  self: boolean
) => {
  if (self) return;

  // TODO: Implement custom commands for the bot
  console.log(Bot, channel, tags, message);
};
