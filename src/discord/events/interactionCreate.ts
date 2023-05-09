import { CommandInteraction } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import { BotsProps, UserProps } from 'src/interfaces';
import { UserModel } from 'src/schemas';
import {
  CoinFlip,
  EightBall,
  Gamble,
  Give,
  Help,
  Points,
  Star,
} from '../commands';

// @todo: add error handling for await statements

export const onInteractionCreate = async (
  Bots: BotsProps,
  interaction: CommandInteraction
) => {
  if (interaction.isChatInputCommand()) {
    if (!interaction.member) {
      await interaction.reply('User does not exist.');
      return;
    }

    if (interaction.commandName === CoinFlip.getName()) {
      return CoinFlip.execute(interaction);
    } else if (interaction.commandName === EightBall.getName()) {
      return EightBall.execute(interaction);
    } else if (interaction.commandName === Help.getName()) {
      return Help.execute(interaction);
    }

    const document = await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .findOne({ discord_id: interaction.member.user.id });

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
      await Bots.db?.collection(Bots.env.MONGODB_USERS).insertOne(userData);
    }

    if (interaction.commandName === Gamble.getName()) {
      return Gamble.execute(Bots, interaction, userData);
    } else if (interaction.commandName === Points.getName()) {
      return Points.execute(interaction, userData);
    }

    const recipient = interaction.options.getUser('user');

    if (!recipient) return;

    const recipientDoc = await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .findOne({ discord_id: recipient.id });

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
      await Bots.db
        ?.collection(Bots.env.MONGODB_USERS)
        .insertOne(recipientData);
    }

    if (interaction.commandName === Give.getName()) {
      return Give.execute(Bots, interaction, userData, recipientData);
    } else if (interaction.commandName === Star.getName()) {
      return Star.execute(Bots, interaction, userData, recipientData);
    }
  }
};
