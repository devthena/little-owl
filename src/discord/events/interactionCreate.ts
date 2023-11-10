import { CommandInteraction } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import { BotsProps, UserProps } from 'src/interfaces';
import { DiscordChannelId, LogEventType } from '../../enums';
import { User } from '../../models';
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

    let userModel;

    try {
      userModel = await User.findOne({
        discord_id: interaction.member.user.id,
      });
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description:
          `Discord Database Error (interactionCreate): ` + JSON.stringify(err),
      });
      console.error(err);
    }

    if (!userModel) {
      try {
        const newUser = new User({
          user_id: uuidv4(),
          discord_id: interaction.member.user.id,
          discord_username: interaction.member.user.username,
        });

        userModel = await newUser.save();
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description:
            `Discord Event Error (interactionCreate): ` + JSON.stringify(err),
        });
        console.error(err);
        return;
      }
    }

    // @todo: need to get rid of this in the future
    const userData: UserProps = {
      user_id: userModel.user_id,
      twitch_id: userModel.twitch_id,
      twitch_username: userModel.twitch_username,
      discord_id: userModel.discord_id,
      discord_username: userModel.discord_username,
      accounts_linked: userModel.accounts_linked,
      cash: userModel.cash,
      bank: userModel.bank,
      stars: userModel.stars,
      power_ups: userModel.power_ups,
    };

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

    let recipientUserModel;
    try {
      recipientUserModel = await User.findOne({
        discord_id: recipient.id,
      });
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description:
          `Discord Database Error (interactionCreate): ` + JSON.stringify(err),
      });
      console.error(err);
      return;
    }

    if (!recipientUserModel) {
      try {
        const newUser = new User({
          user_id: uuidv4(),
          discord_id: recipient.id,
          discord_username: recipient.username,
        });

        recipientUserModel = await newUser.save();
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description:
            `Discord Event Error (interactionCreate): ` + JSON.stringify(err),
        });
        console.error(err);
        return;
      }
    }

    // @todo: need to get rid of this in the future
    const recipientData: UserProps = {
      user_id: recipientUserModel.user_id,
      twitch_id: recipientUserModel.twitch_id,
      twitch_username: recipientUserModel.twitch_username,
      discord_id: recipientUserModel.discord_id,
      discord_username: recipientUserModel.discord_username,
      accounts_linked: recipientUserModel.accounts_linked,
      cash: recipientUserModel.cash,
      bank: recipientUserModel.bank,
      stars: recipientUserModel.stars,
      power_ups: recipientUserModel.power_ups,
    };

    if (interaction.commandName === Give.getName()) {
      return Give.execute(Bots, interaction, userData, recipientData);
    }

    if (interaction.commandName === Star.getName()) {
      return Star.execute(Bots, interaction, userModel, recipientUserModel);
    }
  }
};
