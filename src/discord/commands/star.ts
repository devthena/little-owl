import {
  ColorResolvable,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  User,
} from 'discord.js';

import { CONFIG, COPY, EMOJIS } from '@/constants';
import { ActivityCode } from '@/enums/activities';
import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';

import {
  getActivityByCode,
  pushActivity,
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
      invalidMax: `You can only give one star per day. ${EMOJIS.STAR.INVALID}`,
      invalidSelf: `You can't give yourself a star. ${EMOJIS.STAR.INVALID}`,
    };

    const now = new Date();
    const today = now.toDateString();

    if (interaction.user.id === recipient.id) {
      Bots.reply({
        content: replies.invalidSelf,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    const starActivity = await getActivityByCode(
      Bots,
      interaction.user.id,
      ActivityCode.Star
    );

    if (starActivity && starActivity.last_given === today) {
      Bots.reply({
        content: replies.invalidMax,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    if (!starActivity) {
      await pushActivity(Bots, interaction.user.id, {
        [ActivityCode.Star]: { last_given: today, total_given: 1 },
      });
    } else {
      await updateStarActivity(Bots, interaction.user.id, today);
    }

    await incDiscordUser(Bots, recipient.id, { stars: 1 });

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
