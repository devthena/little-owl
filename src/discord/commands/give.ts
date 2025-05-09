import { CommandInteraction, SlashCommandBuilder, User } from 'discord.js';

import { CONFIG, COPY, EMOJIS } from '@/constants';
import { UserDocument } from '@/interfaces/user';
import { getCurrency } from '@/lib/utils';
import { incDiscordUser, setDiscordUser } from '@/services/user';

import { reply } from '../helpers';

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
    interaction: CommandInteraction,
    user: UserDocument,
    recipient: User
  ) => {
    if (!CONFIG.FEATURES.GIVE.ENABLED) {
      reply({
        content: COPY.DISABLED,
        ephemeral: true,
        interaction: interaction,
      });
      return;
    }

    const amount = Number(interaction.options.get('amount')?.value) || 0;

    const replies = {
      invalidNegative: `You should give at least 1 ${CONFIG.CURRENCY.SINGLE}.`,
      invalidRecipient: `You can't give yourself ${CONFIG.CURRENCY.PLURAL}. ${EMOJIS.GIVE.INVALID}`,
      noPoints: `Sorry, you have no ${CONFIG.CURRENCY.SINGLE} to give. ${EMOJIS.GIVE.INVALID}`,
      notEnough: `Sorry, you don't have enough ${CONFIG.CURRENCY.PLURAL} to give. ${EMOJIS.GIVE.INVALID}`,
      success: `You gave ${recipient.displayName} ${amount} ${getCurrency(
        amount
      )}.`,
    };

    if (user.cash < 1) {
      reply({
        content: replies.noPoints,
        ephemeral: true,
        interaction: interaction,
      });
      return;
    }

    if (amount < 1) {
      reply({
        content: replies.invalidNegative,
        ephemeral: true,
        interaction: interaction,
      });
      return;
    }

    if (user.cash < amount) {
      reply({
        content: replies.notEnough,
        ephemeral: true,
        interaction: interaction,
      });
      return;
    }

    if (user.discord_id === recipient.id) {
      reply({
        content: replies.invalidRecipient,
        ephemeral: true,
        interaction: interaction,
      });
      return;
    }

    await incDiscordUser(recipient.id, { cash: amount });
    await setDiscordUser(interaction.user.id, {
      cash: (user.cash -= amount),
    });

    reply({
      content: `${replies.success} Your new balance: ${user.cash} ${EMOJIS.CURRENCY}`,
      ephemeral: false,
      interaction: interaction,
    });
  },
  getName: (): string => {
    return COPY.GIVE.NAME;
  },
};
