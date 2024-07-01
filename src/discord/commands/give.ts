import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { UserObject } from 'src/schemas';
import { BotsProps } from 'src/types';

import { CONFIG, COPY, EMOJIS } from '../../constants';
import { LogEventType } from '../../enums';
import { getCurrency } from '../../utils';

export const Give = {
  data: new SlashCommandBuilder()
    .setName(COPY.GIVE.NAME)
    .setDescription(COPY.GIVE.DESCRIPTION)
    .addUserOption(option =>
      option
        .setName(COPY.GIVE.OPTION1_NAME)
        .setDescription(COPY.GIVE.OPTION1_DESCRIPTION)
        .setRequired(true)
    )
    .addNumberOption(option =>
      option
        .setName(COPY.GIVE.OPTION2_NAME)
        .setDescription(COPY.GIVE.OPTION2_DESCRIPTION)
        .setRequired(true)
    ),
  execute: async (
    Bots: BotsProps,
    interaction: CommandInteraction,
    user: UserObject,
    recipient: UserObject
  ) => {
    if (!CONFIG.FEATURES.GIVE.ENABLED) {
      try {
        await interaction.reply({ content: COPY.DISABLED, ephemeral: true });
      } catch (error) {
        Bots.log({
          type: LogEventType.Error,
          description: `Discord Command Error (Give): ` + JSON.stringify(error),
        });
      }
      return;
    }

    const amount = Number(interaction.options.get('amount')?.value) || 0;
    const replies = {
      invalidNegative: `You should give at least 1 ${CONFIG.CURRENCY.SINGLE}.`,
      invalidRecipient: `You can't give yourself ${CONFIG.CURRENCY.PLURAL}. ${EMOJIS.GIVE.INVALID}`,
      noPoints: `Sorry, you have no ${CONFIG.CURRENCY.SINGLE} to give. ${EMOJIS.GIVE.INVALID}`,
      notEnough: `Sorry, you don't have enough ${CONFIG.CURRENCY.PLURAL} to give. ${EMOJIS.GIVE.INVALID}`,
      success: `You gave ${
        recipient.discord_name || recipient.discord_username
      } ${amount} ${getCurrency(amount)}.`,
    };

    if (user.cash < 1) {
      try {
        await interaction.reply({ content: replies.noPoints, ephemeral: true });
      } catch (error) {
        Bots.log({
          type: LogEventType.Error,
          description: `Discord Command Error (Give): ` + JSON.stringify(error),
        });
      }
      return;
    }

    if (amount < 1) {
      try {
        await interaction.reply({
          content: replies.invalidNegative,
          ephemeral: true,
        });
      } catch (error) {
        Bots.log({
          type: LogEventType.Error,
          description: `Discord Command Error (Give): ` + JSON.stringify(error),
        });
      }
      return;
    }

    if (user.cash < amount) {
      try {
        await interaction.reply({
          content: replies.notEnough,
          ephemeral: true,
        });
      } catch (error) {
        Bots.log({
          type: LogEventType.Error,
          description: `Discord Command Error (Give): ` + JSON.stringify(error),
        });
      }
      return;
    }

    if (user.discord_id === recipient.discord_id) {
      try {
        await interaction.reply({
          content: replies.invalidRecipient,
          ephemeral: true,
        });
      } catch (error) {
        Bots.log({
          type: LogEventType.Error,
          description: `Discord Command Error (Give): ` + JSON.stringify(error),
        });
      }
      return;
    }

    try {
      await Bots.db
        ?.collection(Bots.env.MONGODB_USERS)
        .updateOne(
          { discord_id: recipient.discord_id },
          { $set: { cash: (recipient.cash += amount) } }
        );

      await Bots.db
        ?.collection(Bots.env.MONGODB_USERS)
        .updateOne(
          { discord_id: user.discord_id },
          { $set: { cash: (user.cash -= amount) } }
        );
    } catch (error) {
      Bots.log({
        type: LogEventType.Error,
        description: `Discord Database Error (Give): ` + JSON.stringify(error),
      });
    }

    try {
      await interaction.reply({
        content: `${replies.success} Current balance: ${user.cash} ${EMOJIS.CURRENCY}`,
      });
    } catch (error) {
      Bots.log({
        type: LogEventType.Error,
        description: `Discord Command Error (Give): ` + JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.GIVE.NAME;
  },
};
