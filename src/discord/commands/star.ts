import {
  ColorResolvable,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  User,
} from 'discord.js';

import { CONFIG, COPY, EMOJIS } from '@/constants';
import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';

import {
  findOrCreateStarActivity,
  updateStarActivity,
} from '@/services/activities';

import { incDiscordUser } from '@/services/user';

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
    Bots: BotsProps,
    interaction: CommandInteraction,
    recipient: User
  ) => {
    if (!CONFIG.FEATURES.STAR.ENABLED) {
      Bots.reply({
        content: COPY.DISABLED,
        ephimeral: true,
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
      Bots.reply({
        content: replies.invalidSelf,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    const starActivity = await findOrCreateStarActivity(
      Bots.log,
      interaction.user.id
    );

    if (!starActivity) {
      Bots.reply({
        content: replies.error,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    const today = new Date().toDateString();

    if (starActivity.last_given === today) {
      Bots.reply({
        content: replies.invalidMax,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    await updateStarActivity(Bots.log, interaction.user.id);
    await incDiscordUser(Bots.log, recipient.id, { stars: 1 });

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
      Bots.log({
        type: LogCode.Error,
        description: JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.STAR.NAME;
  },
};
