import { version } from 'process';
import * as tmi from 'tmi.js';

if (parseInt(version.slice(1).split('.')[0], 10) < 16) {
  throw new Error(
    'Node 16.0.0 or higher is required. Update Node on your system.'
  );
}

require('dotenv').config();

const twitchBot = new tmi.Client({
  options: { debug: true },
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  channels: process.env.CHANNELS?.split(','),
});

twitchBot.connect().catch(console.error);
