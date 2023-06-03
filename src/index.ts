import { version } from 'process';

if (parseInt(version.slice(1).split('.')[0], 10) < 16) {
  throw new Error(
    'Node 16.0.0 or higher is required. Update Node on your system.'
  );
}

import * as djs from 'discord.js';
import * as tmi from 'tmi.js';

import mongoose from 'mongoose';
import { connectToDatabase } from './db';
import { BotsProps } from './interfaces';

import {
  onGuildBanAdd,
  onGuildMemberAdd,
  onGuildMemberRemove,
  onInteractionCreate,
  onMessageCreate,
  onMessageDelete,
  onMessageDeleteBulk,
  onPresenceUpdate,
  onReady,
} from './discord/events';

import {
  onBan,
  onChat,
  onCheer,
  onJoin,
  onPart,
  onRaided,
  onResub,
  onSubGift,
  onSubMysteryGift,
  onSubscription,
  onTimeout,
} from './twitch/events';

import { appConfig } from './config';

export const Bots: BotsProps = {
  cooldowns: {
    streamAlerts: false,
  },
  db: null,
  discord: new djs.Client({
    intents: [
      djs.GatewayIntentBits.DirectMessages,
      djs.GatewayIntentBits.GuildMembers,
      djs.GatewayIntentBits.GuildMessageReactions,
      djs.GatewayIntentBits.GuildMessages,
      djs.GatewayIntentBits.GuildModeration,
      djs.GatewayIntentBits.GuildPresences,
      djs.GatewayIntentBits.Guilds,
      djs.GatewayIntentBits.MessageContent,
    ],
  }),
  env: appConfig.env,
  twitch: new tmi.Client({
    options: { debug: true },
    identity: {
      username: appConfig.twitch.identity.username,
      password: appConfig.twitch.identity.password,
    },
    channels: appConfig.twitch.channels,
  }),
};

const initBots = async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    return console.warn(error);
  }

  console.log('* Database connection successful *');
  Bots.db = mongoose.connection.db;

  Bots.discord.on('guildBanAdd', onGuildBanAdd.bind(null, Bots));
  Bots.discord.on('guildMemberAdd', onGuildMemberAdd.bind(null, Bots));
  Bots.discord.on('guildMemberRemove', onGuildMemberRemove.bind(null, Bots));
  Bots.discord.on('interactionCreate', onInteractionCreate.bind(null, Bots));
  Bots.discord.on('messageCreate', onMessageCreate.bind(null, Bots));
  Bots.discord.on('messageDelete', onMessageDelete.bind(null, Bots));
  Bots.discord.on('messageDeleteBulk', onMessageDeleteBulk.bind(null, Bots));
  Bots.discord.on('presenceUpdate', onPresenceUpdate.bind(null, Bots));
  Bots.discord.on('ready', onReady.bind(null, Bots.discord));

  Bots.twitch.on('ban', onBan.bind(null, Bots));
  Bots.twitch.on('chat', onChat.bind(null, Bots));
  Bots.twitch.on('cheer', onCheer.bind(null, Bots));
  Bots.twitch.on('join', onJoin.bind(null, Bots));
  Bots.twitch.on('part', onPart.bind(null, Bots));
  Bots.twitch.on('raided', onRaided.bind(null, Bots));
  Bots.twitch.on('resub', onResub.bind(null, Bots));
  Bots.twitch.on('subgift', onSubGift.bind(null, Bots));
  Bots.twitch.on('submysterygift', onSubMysteryGift.bind(null, Bots));
  Bots.twitch.on('subscription', onSubscription.bind(null, Bots));
  Bots.twitch.on('timeout', onTimeout.bind(null, Bots));

  Bots.discord.login(appConfig.env.DISCORD_TOKEN);
  Bots.twitch.connect().catch(console.error);
};

initBots();
