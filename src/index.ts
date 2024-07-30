import { version } from 'process';

if (parseInt(version.slice(1).split('.')[0], 10) < 20) {
  console.error('🦉 Error: Node Version 20 or Higher Is Required');
  process.exit(1);
}

require('dotenv').config();

import {
  onGuildBanAdd,
  onGuildMemberAdd,
  onGuildMemberRemove,
  onInteractionCreate,
  onMessageCreate,
  onMessageDelete,
  onPresenceUpdate,
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

import { registerDiscordCommands } from '@/discord/helpers';
import { BotState } from '@/interfaces/bot';

import { discord, twitch } from '@/lib/clients';
import { connectDatabase } from '@/lib/config';

import { scheduleTasks } from '@/scheduler';
import { createServerPet } from '@/services/pet';

const state: BotState = {
  activity: 1,
  cooldowns: {
    cerberus: new Map(),
    stream: new Date(),
  },
};

const initBots = async () => {
  await connectDatabase();

  discord.on('guildBanAdd', onGuildBanAdd);
  discord.on('guildMemberAdd', onGuildMemberAdd);
  discord.on('guildMemberRemove', onGuildMemberRemove);
  discord.on('interactionCreate', onInteractionCreate.bind(null, state));
  discord.on('messageCreate', onMessageCreate);
  discord.on('messageDelete', onMessageDelete);
  discord.on('presenceUpdate', onPresenceUpdate.bind(null, state));

  twitch.on('ban', onBan);
  twitch.on('chat', onChat);
  twitch.on('cheer', onCheer);
  twitch.on('join', onJoin);
  twitch.on('part', onPart);
  twitch.on('raided', onRaided);
  twitch.on('resub', onResub);
  twitch.on('subgift', onSubGift);
  twitch.on('submysterygift', onSubMysteryGift);
  twitch.on('subscription', onSubscription);
  twitch.on('timeout', onTimeout);

  createServerPet();
};

if (!process.env.STAGING) registerDiscordCommands();

initBots();
scheduleTasks(state);
