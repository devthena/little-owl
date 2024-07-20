import { CommandInteraction, User } from 'discord.js';

import { CONFIG, COPY, EMOJIS, INITIAL } from '@/constants';
import { addStar, getStarById } from '@/lib/db';
import { StarObject } from '@/models/stars';
import { getDiscordUser } from '@/services/user';
import { BotsProps } from '@/types';

import {
  AccountLink,
  AccountUnlink,
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

export const onInteractionCreate = async (
  Bots: BotsProps,
  interaction: CommandInteraction
) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.user.bot) return;

    const getRecipientStar = async (
      recipient: User
    ): Promise<StarObject | undefined> => {
      const document = await getStarById(Bots, recipient.id);

      const data: StarObject = document ?? {
        ...INITIAL.STAR,
        discord_id: recipient.id,
      };

      if (!document) await addStar(Bots, data);
      return data;
    };

    const getUserStar = async (): Promise<StarObject | undefined> => {
      const document = await getStarById(Bots, interaction.user.id);

      const data: StarObject = document ?? {
        ...INITIAL.STAR,
        discord_id: interaction.user.id,
      };

      if (!document) await addStar(Bots, data);
      return data;
    };

    if (interaction.commandName === AccountLink.getName()) {
      const userData = await getDiscordUser(Bots, interaction.user);
      if (!userData) return;

      return AccountLink.execute(Bots, interaction, userData);
    }

    if (interaction.commandName === AccountUnlink.getName()) {
      const userData = await getDiscordUser(Bots, interaction.user);
      if (!userData) return;

      return AccountUnlink.execute(Bots, interaction, userData);
    }

    if (interaction.commandName === Help.getName()) {
      return Help.execute(Bots, interaction);
    }

    if (interaction.commandName === Star.getName()) {
      const recipient = interaction.options.getUser('user');

      if (!recipient) return;

      if (recipient.bot) {
        Bots.reply({
          content: `I'm only accepting human members for this command. ${EMOJIS.BOT}`,
          ephimeral: true,
          interaction: interaction,
          source: COPY.STAR.NAME,
        });
        return;
      }

      const userStar = await getUserStar();
      const recipientStar = await getRecipientStar(recipient);

      if (!userStar || !recipientStar) return;
      return Star.execute(Bots, interaction, userStar, recipient);
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
        source: 'interactionCreate',
      });
      return;
    }

    if (interaction.commandName === Points.getName()) {
      const userData = await getDiscordUser(Bots, interaction.user);
      if (!userData) return;

      return Points.execute(Bots, interaction, userData);
    }

    if (interaction.commandName === Gamble.getName()) {
      if (!isInCasinoChannel) {
        Bots.reply({
          content: 'Please use the #casino channel to gamble your points.',
          ephimeral: true,
          interaction: interaction,
          source: 'interactionCreate',
        });
        return;
      }

      const userData = await getDiscordUser(Bots, interaction.user);
      if (!userData) return;

      return Gamble.execute(Bots, interaction, userData);
    }

    if (interaction.commandName === Profile.getName()) {
      const userData = await getDiscordUser(Bots, interaction.user);
      const userStar = await getUserStar();

      if (!userData || !userStar) return;
      return Profile.execute(Bots, interaction, userData, userStar);
    }

    if (interaction.commandName === Leaderboard.getName()) {
      return Leaderboard.execute(Bots, interaction);
    }

    if (interaction.commandName === Give.getName()) {
      const recipient = interaction.options.getUser('user');

      if (!recipient) return;

      if (recipient.bot) {
        Bots.reply({
          content: `I'm only accepting human members for this command. ${EMOJIS.BOT}`,
          ephimeral: true,
          interaction: interaction,
          source: COPY.GIVE.NAME,
        });
        return;
      }

      const userData = await getDiscordUser(Bots, interaction.user);
      const recipientData = await getDiscordUser(Bots, recipient);

      if (!userData || !recipientData) return;
      return Give.execute(Bots, interaction, userData, recipient);
    }

    if (interaction.commandName === CoinFlip.getName()) {
      return CoinFlip.execute(Bots, interaction);
    }

    if (interaction.commandName === EightBall.getName()) {
      return EightBall.execute(Bots, interaction);
    }
  }
};
