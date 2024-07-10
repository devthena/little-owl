import {
  ColorResolvable,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  User,
} from 'discord.js';

import { StarObject } from 'src/schemas';
import { BotsProps } from 'src/types';

import { CONFIG, COPY, EMOJIS } from '../../constants';
import { LogEventType } from '../../enums';

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
    star: StarObject,
    recipient: User
  ) => {
    if (!CONFIG.FEATURES.STAR.ENABLED) {
      Bots.reply({
        content: COPY.DISABLED,
        ephimeral: true,
        interaction: interaction,
        source: COPY.STAR.NAME,
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
        source: COPY.STAR.NAME,
      });
      return;
    }

    if (star.last_given === today) {
      Bots.reply({
        content: replies.invalidMax,
        ephimeral: true,
        interaction: interaction,
        source: COPY.STAR.NAME,
      });
      return;
    }

    try {
      await Bots.db
        ?.collection(Bots.env.MONGODB_STARS)
        .updateOne(
          { discord_id: interaction.user.id },
          { $inc: { total_given: 1 }, $set: { last_given: today } }
        );

      await Bots.db
        ?.collection(Bots.env.MONGODB_STARS)
        .updateOne({ discord_id: recipient.id }, { $inc: { stars: 1 } });
    } catch (error) {
      Bots.log({
        type: LogEventType.Error,
        description: `Discord Database Error (Star): ` + JSON.stringify(error),
      });
    }

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
        type: LogEventType.Error,
        description:
          `Discord Command Error (${COPY.STAR.NAME}): ` + JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.STAR.NAME;
  },
};
