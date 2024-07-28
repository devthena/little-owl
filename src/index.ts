import { version } from 'process';

if (parseInt(version.slice(1).split('.')[0], 10) < 20) {
  throw new Error(
    'Node 20.0.0 or higher is required. Update Node on your system.'
  );
}

require('dotenv').config();

import * as djs from 'discord.js';
import * as tmi from 'tmi.js';

import { BotsProps, LogProps, ReplyProps } from '@/interfaces/bot';

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
} from '@/discord/events';

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
} from '@/twitch/events';

import { discordReply, logEvent } from '@/lib';
import { connectDatabase } from '@/lib/config';

import { scheduleTasks } from '@/scheduler';
import { createServerPet } from '@/services/pet';

import { registerDiscordCommands } from '@/discord/helpers';

const Bots: BotsProps = {
  cooldowns: {
    streamAlerts: false,
  },
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
  interactions: new Map(),
  log: (props: LogProps) => {
    logEvent(Bots.discord, props);
  },
  reply: (props: ReplyProps) => {
    discordReply(Bots, props);
  },
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
  await connectDatabase();

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

  await Bots.discord.login(process.env.DISCORD_TOKEN);
  await Bots.twitch.connect();

  createServerPet(Bots.log);
};

if (!process.env.STAGING) registerDiscordCommands();

initBots();
scheduleTasks(Bots);
