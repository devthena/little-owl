import { Client } from 'tmi.js';

if (!process.env.USERNAME || !process.env.PASSWORD || !process.env.CHANNELS) {
  console.error('🦉 Error: TMI.js Missing Environment Variables');
  process.exit(1);
}

const twitch = new Client({
  options: { debug: true },
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  channels: process.env.CHANNELS.split(','),
});

twitch.connect();

export { twitch };
