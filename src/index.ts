import { version } from 'process';

if (parseInt(version.slice(1).split('.')[0], 10) < 16) {
  throw new Error(
    'Node 16.0.0 or higher is required. Update Node on your system.'
  );
}

require('dotenv').config();

import * as djs from 'discord.js';
import * as tmi from 'tmi.js';

import * as mdb from 'mongodb';
const dbClient = new mdb.MongoClient(process.env.MONGODB_URL || '');

import { onReady } from './discord/events';

import { onMessage } from './twitch/events';

type BotsProps = {
  db: mdb.Db | null;
  discord: djs.Client<boolean>;
  twitch: tmi.Client;
};

const Bots: BotsProps = {
  db: null,
  discord: new djs.Client({
    intents: [
      djs.GatewayIntentBits.DirectMessages,
      djs.GatewayIntentBits.GuildBans,
      djs.GatewayIntentBits.GuildMembers,
      djs.GatewayIntentBits.GuildMessageReactions,
      djs.GatewayIntentBits.GuildMessages,
      djs.GatewayIntentBits.GuildPresences,
    ],
  }),
  twitch: new tmi.Client({
    options: { debug: true },
    identity: {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    },
    channels: process.env.CHANNELS?.split(','),
  }),
};

const initBots = async () => {
  try {
    await dbClient.connect();
  } catch (error) {
    return console.warn(error);
  }

  console.log('* Database connection successful *');

  Bots.db = dbClient.db(process.env.MONGODB_DB);

  Bots.discord.on('ready', onReady.bind(null, Bots.discord));

  Bots.twitch.on('message', onMessage.bind(null, Bots.twitch));

  Bots.twitch.connect().catch(console.error);
  Bots.discord.login(process.env.TOKEN);
};

initBots();
