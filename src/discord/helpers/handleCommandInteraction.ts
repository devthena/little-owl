import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';

import { CONFIG, EMOJIS } from '@/constants';
import { BotState } from '@/interfaces/bot';

import { getServerPet } from '@/services/pet';
import { findOrCreateDiscordUser } from '@/services/user';

import {
  AccountLink,
  AccountUnlink,
  Bonus,
  Cerberus,
  CoinFlip,
  EightBall,
  Gamble,
  Give,
  Help,
  Leaderboard,
  Points,
  Profile,
  Star,
} from '../commands';

import { reply } from './reply';

export const handleCommandInteraction = async (
  state: BotState,
  interaction: CommandInteraction
) => {
  if (interaction.user.bot) return;

  const replyNoBot = () => {
    reply({
      content: `I'm only accepting human members for this command. ${EMOJIS.BOT}`,
      ephimeral: true,
      interaction: interaction,
    });
  };

  // command: link
  if (interaction.commandName === AccountLink.getName()) {
    const user = await findOrCreateDiscordUser(interaction.user);
    if (!user) return;

    return AccountLink.execute(interaction, user);
  }

  // command: unlink
  else if (interaction.commandName === AccountUnlink.getName()) {
    const user = await findOrCreateDiscordUser(interaction.user);
    if (!user) return;

    return AccountUnlink.execute(interaction, user);
  }

  // command: help
  else if (interaction.commandName === Help.getName()) {
    return Help.execute(interaction);
  }

  // command: star
  else if (interaction.commandName === Star.getName()) {
    const options = interaction.options as CommandInteractionOptionResolver;
    const recipient = options.getUser('user');

    if (!recipient) return;
    if (recipient.bot) return replyNoBot();

    return Star.execute(interaction, recipient);
  }

  const isInCasinoChannel =
    interaction.channelId === CONFIG.CHANNELS.MAIN.CASINO ||
    interaction.channelId === CONFIG.CHANNELS.MAIN.STAGE;

  const isInBotChannel =
    interaction.channelId === CONFIG.CHANNELS.MAIN.CASINO ||
    interaction.channelId === CONFIG.CHANNELS.MAIN.OWL ||
    interaction.channelId === CONFIG.CHANNELS.MAIN.STAGE;

  if (!isInBotChannel) {
    reply({
      content: 'Please use this command in one of the bot channels.',
      ephimeral: true,
      interaction: interaction,
    });
    return;
  }

  // command: points
  if (interaction.commandName === Points.getName()) {
    const user = await findOrCreateDiscordUser(interaction.user);
    if (!user) return;

    return Points.execute(interaction, user);
  }

  // command: gamble
  else if (interaction.commandName === Gamble.getName()) {
    if (!isInCasinoChannel) {
      reply({
        content: 'Please use the #casino channel to gamble your points.',
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    const user = await findOrCreateDiscordUser(interaction.user);
    if (!user) return;

    return Gamble.execute(interaction, user);
  }

  // command: profile
  else if (interaction.commandName === Profile.getName()) {
    const user = await findOrCreateDiscordUser(interaction.user);
    if (!user) return;

    return Profile.execute(interaction, user);
  }

  // command: leaderboard
  else if (interaction.commandName === Leaderboard.getName()) {
    return Leaderboard.execute(interaction);
  }

  // command: cerberus
  else if (interaction.commandName === Cerberus.getName()) {
    const cerberus = await getServerPet();
    if (!cerberus) return;

    return Cerberus.execute(state, interaction, cerberus);
  }

  // command: give
  else if (interaction.commandName === Give.getName()) {
    const options = interaction.options as CommandInteractionOptionResolver;
    const mentioned = options.getUser('user');

    if (!mentioned) return;
    if (mentioned.bot) return replyNoBot();

    const user = await findOrCreateDiscordUser(interaction.user);
    const recipient = await findOrCreateDiscordUser(mentioned);

    if (!user || !recipient) return;
    return Give.execute(interaction, user, mentioned);
  }

  // command: bonus
  else if (interaction.commandName === Bonus.getName()) {
    const options = interaction.options as CommandInteractionOptionResolver;
    const mentioned = options.getUser('user');

    if (!mentioned) return;
    if (mentioned.bot) return replyNoBot();

    const recipient = await findOrCreateDiscordUser(mentioned);

    if (!recipient) return;
    return Bonus.execute(interaction, mentioned);
  }

  // command: coinflip
  else if (interaction.commandName === CoinFlip.getName()) {
    return CoinFlip.execute(interaction);
  }

  // command: 8ball
  else if (interaction.commandName === EightBall.getName()) {
    return EightBall.execute(interaction);
  }
};
