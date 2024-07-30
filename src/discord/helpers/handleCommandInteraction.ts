import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';

import { CONFIG, EMOJIS } from '@/constants';
import { BotsProps } from '@/interfaces/bot';
import { getServerPet } from '@/services/pet';
import { findOrCreateDiscordUser } from '@/services/user';

import {
  AccountLink,
  AccountUnlink,
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

export const handleCommandInteraction = async (
  Bots: BotsProps,
  interaction: CommandInteraction
) => {
  if (interaction.user.bot) return;

  const replyNoBot = () => {
    Bots.reply({
      content: `I'm only accepting human members for this command. ${EMOJIS.BOT}`,
      ephimeral: true,
      interaction: interaction,
    });
  };

  if (interaction.commandName === AccountLink.getName()) {
    const user = await findOrCreateDiscordUser(Bots.log, interaction.user);
    if (!user) return;

    return AccountLink.execute(Bots, interaction, user);
  }

  if (interaction.commandName === AccountUnlink.getName()) {
    const user = await findOrCreateDiscordUser(Bots.log, interaction.user);
    if (!user) return;

    return AccountUnlink.execute(Bots, interaction, user);
  }

  if (interaction.commandName === Help.getName()) {
    return Help.execute(Bots, interaction);
  }

  if (interaction.commandName === Star.getName()) {
    const options = interaction.options as CommandInteractionOptionResolver;
    const recipient = options.getUser('user');

    if (!recipient) return;
    if (recipient.bot) return replyNoBot();

    return Star.execute(Bots, interaction, recipient);
  }

  const isInCasinoChannel =
    interaction.channelId === CONFIG.CHANNELS.MAIN.CASINO ||
    interaction.channelId === CONFIG.CHANNELS.MAIN.STAGE;

  const isInBotChannel =
    interaction.channelId === CONFIG.CHANNELS.MAIN.CASINO ||
    interaction.channelId === CONFIG.CHANNELS.MAIN.OWL ||
    interaction.channelId === CONFIG.CHANNELS.MAIN.STAGE;

  if (!isInBotChannel) {
    Bots.reply({
      content: 'Please use this command in one of the bot channels.',
      ephimeral: true,
      interaction: interaction,
    });
    return;
  }

  if (interaction.commandName === Points.getName()) {
    const user = await findOrCreateDiscordUser(Bots.log, interaction.user);
    if (!user) return;

    return Points.execute(Bots, interaction, user);
  }

  if (interaction.commandName === Gamble.getName()) {
    if (!isInCasinoChannel) {
      Bots.reply({
        content: 'Please use the #casino channel to gamble your points.',
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    const user = await findOrCreateDiscordUser(Bots.log, interaction.user);
    if (!user) return;

    return Gamble.execute(Bots, interaction, user);
  }

  if (interaction.commandName === Profile.getName()) {
    const user = await findOrCreateDiscordUser(Bots.log, interaction.user);
    if (!user) return;

    return Profile.execute(Bots, interaction, user);
  }

  if (interaction.commandName === Leaderboard.getName()) {
    return Leaderboard.execute(Bots, interaction);
  }

  if (interaction.commandName === Cerberus.getName()) {
    const cerberus = await getServerPet(Bots.log);
    if (!cerberus) return;

    return Cerberus.execute(Bots, interaction, cerberus);
  }

  if (interaction.commandName === Give.getName()) {
    const options = interaction.options as CommandInteractionOptionResolver;
    const mentioned = options.getUser('user');

    if (!mentioned) return;
    if (mentioned.bot) return replyNoBot();

    const user = await findOrCreateDiscordUser(Bots.log, interaction.user);
    const recipient = await findOrCreateDiscordUser(Bots.log, mentioned);

    if (!user || !recipient) return;
    return Give.execute(Bots, interaction, user, mentioned);
  }

  if (interaction.commandName === CoinFlip.getName()) {
    return CoinFlip.execute(Bots, interaction);
  }

  if (interaction.commandName === EightBall.getName()) {
    return EightBall.execute(Bots, interaction);
  }
};
