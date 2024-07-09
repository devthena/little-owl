import { CommandInteraction } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import { StarObject, UserObject } from 'src/schemas';
import { BotsProps } from 'src/types';

import { CONFIG, INITIAL } from '../../constants';
import { addStar, addUser, getStarById, getUserById } from '../../lib/db';

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
    const getRecipientStar = async (): Promise<StarObject | undefined> => {
      const recipient = interaction.options.getUser('user');

      if (!recipient) return;

      const document = await getStarById(Bots, recipient.id);

      const data: StarObject = document ?? {
        ...INITIAL.STAR,
        discord_id: recipient.id,
      };

      if (!document) await addStar(Bots, data);
      return data;
    };

    const getUserStar = async (): Promise<StarObject | undefined> => {
      if (!interaction.member) return;

      const document = await getStarById(Bots, interaction.member.user.id);

      const data: StarObject = document ?? {
        ...INITIAL.STAR,
        discord_id: interaction.member?.user.id,
      };

      if (!document) await addStar(Bots, data);
      return data;
    };

    const getRecipientData = async (): Promise<UserObject | undefined> => {
      const recipient = interaction.options.getUser('user');

      if (!recipient) return;

      const document = await getUserById(Bots, recipient.id);

      const data: UserObject = document ?? {
        ...INITIAL.USER,
        user_id: uuidv4(),
        discord_id: recipient.id,
        discord_username: recipient.username,
        discord_name: recipient.globalName,
      };

      if (!document) await addUser(Bots, data);
      return data;
    };

    const getUserData = async (): Promise<UserObject | undefined> => {
      if (!interaction.member) return;

      const document = await getUserById(Bots, interaction.member.user.id);

      const data: UserObject = document ?? {
        ...INITIAL.USER,
        user_id: uuidv4(),
        discord_id: interaction.member.user.id,
        discord_username: interaction.member.user.username,
        discord_name: interaction.user.globalName,
      };

      if (!document) await addUser(Bots, data);
      return data;
    };

    if (interaction.commandName === AccountLink.getName()) {
      const userData = await getUserData();
      if (!userData) return;
      return AccountLink.execute(Bots, interaction, userData);
    }

    if (interaction.commandName === AccountUnlink.getName()) {
      const userData = await getUserData();
      if (!userData) return;
      return AccountUnlink.execute(Bots, interaction, userData);
    }

    if (interaction.commandName === Help.getName()) {
      return Help.execute(Bots, interaction);
    }

    if (interaction.commandName === Star.getName()) {
      const recipient = interaction.options.getUser('user');

      if (!recipient) return;

      const userStar = await getUserStar();
      const recipientActivity = await getRecipientStar();

      if (!userStar || !recipientActivity) return;

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
      const userData = await getUserData();
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

      const userData = await getUserData();
      if (!userData) return;

      return Gamble.execute(Bots, interaction, userData);
    }

    if (interaction.commandName === Profile.getName()) {
      const userData = await getUserData();
      const userStar = await getUserStar();

      if (!userData || !userStar) return;

      return Profile.execute(Bots, interaction, userData, userStar);
    }

    if (interaction.commandName === Leaderboard.getName()) {
      return Leaderboard.execute(Bots, interaction);
    }

    if (interaction.commandName === Give.getName()) {
      const userData = await getUserData();
      const recipientData = await getRecipientData();

      if (!userData || !recipientData) return;
      return Give.execute(Bots, interaction, userData, recipientData);
    }

    if (interaction.commandName === CoinFlip.getName()) {
      return CoinFlip.execute(Bots, interaction);
    }

    if (interaction.commandName === EightBall.getName()) {
      return EightBall.execute(Bots, interaction);
    }
  }
};
