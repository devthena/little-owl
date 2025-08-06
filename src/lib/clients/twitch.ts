import { Client, RoomState } from 'tmi.js';

if (!process.env.USERNAME || !process.env.PASSWORD || !process.env.CHANNELS) {
  console.error('🦉 Error: TMI.js Missing Environment Variables');
  process.exit(1);
}

const twitch = new Client({
  options: { debug: !!process.env.STAGING },
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  channels: process.env.CHANNELS.split(','),
});

twitch.on('connected', () => {
  console.log('🦉 Little Owl: TMI.js Connected');
});

twitch.on('roomstate', (channel: string, _state: RoomState) => {
  console.log('🦉 Little Owl: Roomstate', channel);
});

twitch.connect();

export { twitch };
