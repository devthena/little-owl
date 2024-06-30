import { CommandInteraction } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import { BotsProps } from 'src/interfaces';
import { StarObject, UserObject } from 'src/schemas';
import { NEW_STAR, NEW_USER } from '../../constants';
import { DiscordChannelId, LogEventType } from '../../enums';
import { logEvent } from '../../utils';
import { addStar, addUser, getStarById, getUserById } from '../../utils/db';

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
        ...NEW_STAR,
        discord_id: recipient.id,
      };

      if (!document) await addStar(Bots, data);
      return data;
    };

    const getUserStar = async (): Promise<StarObject | undefined> => {
      if (!interaction.member) return;

      const document = await getStarById(Bots, interaction.member.user.id);

      const data: StarObject = document ?? {
        ...NEW_STAR,
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
        ...NEW_USER,
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
        ...NEW_USER,
        user_id: uuidv4(),
        discord_id: interaction.member.user.id,
        discord_username: interaction.member.user.username,
        discord_name: interaction.user.globalName,
      };

      if (!document) await addUser(Bots, data);
      return data;
    };

    if (interaction.commandName === CoinFlip.getName()) {
      return CoinFlip.execute(Bots, interaction);
    }

    if (interaction.commandName === EightBall.getName()) {
      return EightBall.execute(Bots, interaction);
    }

    if (interaction.commandName === Help.getName()) {
      return Help.execute(Bots, interaction);
    }

    if (interaction.commandName === Leaderboard.getName()) {
      return Leaderboard.execute(Bots, interaction);
    }

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

    if (interaction.commandName === Give.getName()) {
      const userData = await getUserData();
      const recipientData = await getRecipientData();

      if (!userData || !recipientData) return;
      return Give.execute(Bots, interaction, userData, recipientData);
    }

    if (interaction.commandName === Gamble.getName()) {
      if (
        interaction.channelId !== DiscordChannelId.Casino &&
        interaction.channelId !== DiscordChannelId.Test
      ) {
        try {
          await interaction.reply({
            content: 'Please use the #casino channel to gamble your points.',
            ephemeral: true,
          });
        } catch (err) {
          logEvent({
            Bots,
            type: LogEventType.Error,
            description:
              `Discord Event Error (interactionCreate): ` + JSON.stringify(err),
          });
        }
      } else {
        const userData = await getUserData();
        if (!userData) return;
        Gamble.execute(Bots, interaction, userData);
      }
      return;
    }

    if (interaction.commandName === Points.getName()) {
      if (
        interaction.channelId !== DiscordChannelId.Casino &&
        interaction.channelId !== DiscordChannelId.LittleOwl &&
        interaction.channelId !== DiscordChannelId.Test
      ) {
        try {
          await interaction.reply({
            content:
              'Please use one of the bot channels to check your balance.',
            ephemeral: true,
          });
        } catch (err) {
          logEvent({
            Bots,
            type: LogEventType.Error,
            description:
              `Discord Event Error (interactionCreate): ` + JSON.stringify(err),
          });
          console.error(err);
        }
      } else {
        const userData = await getUserData();
        if (!userData) return;
        Points.execute(Bots, interaction, userData);
      }
      return;
    }

    if (interaction.commandName === Star.getName()) {
      const recipient = interaction.options.getUser('user');

      if (!recipient) return;

      const userActivity = await getUserStar();
      const recipientActivity = await getRecipientStar();

      if (!userActivity || !recipientActivity) return;

      const userName = interaction.user.globalName || interaction.user.username;

      return Star.execute(Bots, interaction, userActivity, userName, recipient);
    }
  }
};
