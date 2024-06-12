import { CommandInteraction } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import { BotsProps } from 'src/interfaces';
import { UserObject } from 'src/schemas';
import { NEW_USER } from '../../constants';
import { DiscordChannelId, LogEventType } from '../../enums';
import { logEvent } from '../../utils';
import { addUser, getUserById } from '../../utils/db';

import {
  AccountLink,
  AccountUnlink,
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

    const document = await getUserById(Bots, interaction.member.user.id);

    const userData: UserObject = document ?? {
      ...NEW_USER,
      user_id: uuidv4(),
      discord_id: interaction.member.user.id,
      discord_username: interaction.member.user.username,
      discord_name: interaction.user.globalName,
    };

    if (!document) await addUser(Bots, userData);

    if (interaction.commandName === AccountLink.getName()) {
      return AccountLink.execute(Bots, interaction, userData);
    }

    if (interaction.commandName === AccountUnlink.getName()) {
      return AccountUnlink.execute(Bots, interaction, userData);
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
        Points.execute(Bots, interaction, userData);
      }
      return;
    }

    const recipient = interaction.options.getUser('user');

    if (!recipient) return;

    const recipientDoc = await getUserById(Bots, recipient.id);

    const recipientData: UserObject = recipientDoc ?? {
      ...NEW_USER,
      user_id: uuidv4(),
      discord_id: recipient.id,
      discord_username: recipient.username,
      discord_name: recipient.globalName,
    };

    if (!recipientDoc) await addUser(Bots, recipientData);

    if (interaction.commandName === Give.getName()) {
      return Give.execute(Bots, interaction, userData, recipientData);
    }

    if (interaction.commandName === Star.getName()) {
      return Star.execute(Bots, interaction, userData, recipientData);
    }
  }
};
