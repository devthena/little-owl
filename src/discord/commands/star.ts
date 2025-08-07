import {
  ColorResolvable,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  User,
} from 'discord.js';

import { CONFIG, COPY, EMOJIS } from '@/constants';
import { LogCode } from '@/enums/logs';

import {
  findOrCreateStarActivity,
  updateStarActivity,
} from '@/services/activities';

import { incDiscordUser } from '@/services/user';

import { log, reply } from '../helpers';

export const Star = {
  data: new SlashCommandBuilder()
    .setName(COPY.STAR.NAME)
    .setDescription(COPY.STAR.DESCRIPTION)
    .addUserOption(option =>
      option
        .setName(COPY.STAR.OPTION_NAME)
        .setDescription(COPY.STAR.OPTION_DESCRIPTION)
        .setRequired(true)
    ),
  execute: async (
    interaction: ChatInputCommandInteraction,
    recipient: User
  ) => {
    if (!CONFIG.FEATURES.STAR.ENABLED) {
      reply({
        content: COPY.DISABLED,
        ephemeral: true,
        interaction: interaction,
      });
      return;
    }

    const replies = {
      error: 'Something went wrong. Please try again later.',
      invalidMax: `You can only give one star per day. ${EMOJIS.STAR.INVALID}`,
      invalidSelf: `You can't give yourself a star. ${EMOJIS.STAR.INVALID}`,
    };

    if (interaction.user.id === recipient.id) {
      reply({
        content: replies.invalidSelf,
        ephemeral: true,
        interaction: interaction,
      });
      return;
    }

    const starActivity = await findOrCreateStarActivity(interaction.user.id);

    if (!starActivity) {
      reply({
        content: replies.error,
        ephemeral: true,
        interaction: interaction,
      });
      return;
    }

    const today = new Date().toDateString();

    if (starActivity.last_given === today) {
      reply({
        content: replies.invalidMax,
        ephemeral: true,
        interaction: interaction,
      });
      return;
    }

    await updateStarActivity(interaction.user.id);
    await incDiscordUser(recipient.id, { stars: 1 });

    const botEmbed = new EmbedBuilder()
      .setColor(CONFIG.COLORS.YELLOW as ColorResolvable)
      .setTitle(
        `${recipient.displayName} got a star from ${interaction.user.displayName}!`
      )
      .setDescription(
        `Endorse a community member by giving them a star! ${EMOJIS.STAR.EMBED}`
      );

    try {
      await interaction.reply({ embeds: [botEmbed] });
    } catch (error) {
      log({
        type: LogCode.Error,
        description: JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.STAR.NAME;
  },
};
