import { CommandInteraction } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import { BotsProps, UserProps } from 'src/interfaces';
import { DiscordChannelId, LogEventType } from '../../enums';
import { UserModel } from '../../schemas';
import { logEvent } from '../../utils';

import {
  CoinFlip,
  EightBall,
  Gamble,
  Give,
  Help,
  Points,
  Star,
} from '../commands';

export const onInteractionCreate = async (
  Bots: BotsProps,
  interaction: CommandInteraction
) => {
  if (interaction.isChatInputCommand()) {
    if (!interaction.member) {
      try {
        await interaction.reply('User does not exist.');
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description:
            `Discord Event Error (interactionCreate): ` + JSON.stringify(err),
        });
        console.error(err);
      }
      return;
    }

    if (interaction.commandName === CoinFlip.getName()) {
      return CoinFlip.execute(Bots, interaction);
    }

    if (interaction.commandName === EightBall.getName()) {
      return EightBall.execute(Bots, interaction);
    }

    if (interaction.commandName === Help.getName()) {
      return Help.execute(Bots, interaction);
    }

    const document = await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .findOne({ discord_id: interaction.member.user.id })
      .catch(err => {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description:
            `Discord Database Error (interactionCreate): ` +
            JSON.stringify(err),
        });
        console.error(err);
      });

    const userData: UserProps = document
      ? {
          user_id: document.user_id,
          twitch_id: document.twitch_id,
          twitch_username: document.twitch_username,
          discord_id: document.discord_id,
          discord_username: document.discord_username,
          accounts_linked: document.accounts_linked,
          cash: document.cash,
          bank: document.bank,
          stars: document.stars,
          power_ups: document.power_ups,
        }
      : {
          ...UserModel,
          user_id: uuidv4(),
          discord_id: interaction.member.user.id,
          discord_username: interaction.member.user.username,
        };

    if (!document) {
      try {
        await Bots.db?.collection(Bots.env.MONGODB_USERS).insertOne(userData);
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description:
            `Discord Event Error (interactionCreate): ` + JSON.stringify(err),
        });
        console.error(err);
      }
    }

    if (interaction.commandName === Gamble.getName()) {
      if (interaction.channelId !== DiscordChannelId.Casino) {
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
          console.error(err);
        }
      } else {
        Gamble.execute(Bots, interaction, userData);
      }
      return;
    }

    if (interaction.commandName === Points.getName()) {
      if (
        interaction.channelId !== DiscordChannelId.Casino &&
        interaction.channelId !== DiscordChannelId.LittleOwl
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
        Points.execute(Bots, interaction, userData);
      }
      return;
    }

    const recipient = interaction.options.getUser('user');

    if (!recipient) return;

    const recipientDoc = await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .findOne({ discord_id: recipient.id })
      .catch(err => {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description:
            `Discord Database Error (interactionCreate): ` +
            JSON.stringify(err),
        });
        console.error(err);
      });

    const recipientData: UserProps = recipientDoc
      ? {
          user_id: recipientDoc.user_id,
          twitch_id: recipientDoc.twitch_id,
          twitch_username: recipientDoc.twitch_username,
          discord_id: recipientDoc.discord_id,
          discord_username: recipientDoc.discord_username,
          accounts_linked: recipientDoc.accounts_linked,
          cash: recipientDoc.cash,
          bank: recipientDoc.bank,
          stars: recipientDoc.stars,
          power_ups: recipientDoc.power_ups,
        }
      : {
          ...UserModel,
          user_id: uuidv4(),
          discord_id: recipient.id,
          discord_username: recipient.username,
        };

    if (!recipientDoc) {
      try {
        await Bots.db
          ?.collection(Bots.env.MONGODB_USERS)
          .insertOne(recipientData);
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description:
            `Discord Event Error (interactionCreate): ` + JSON.stringify(err),
        });
        console.error(err);
      }
    }

    if (interaction.commandName === Give.getName()) {
      return Give.execute(Bots, interaction, userData, recipientData);
    }

    if (interaction.commandName === Star.getName()) {
      return Star.execute(Bots, interaction, userData, recipientData);
    }
  }
};
