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
import { logEvent } from '../../utils';

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
    user: StarObject,
    userName: string,
    recipient: User
  ) => {
    if (!CONFIG.FEATURES.STAR.ENABLED) {
      try {
        await interaction.reply({ content: COPY.DISABLED, ephemeral: true });
      } catch (error) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description: `Discord Command Error (Star): ` + JSON.stringify(error),
        });
      }
      return;
    }

    const replies = {
      invalidMax: `You can only give one star per day. ${EMOJIS.STAR.INVALID}`,
      invalidSelf: `You can't give yourself a star. ${EMOJIS.STAR.INVALID}`,
    };

    const now = new Date();
    const today = now.toDateString();

    if (user.discord_id === recipient.id) {
      await interaction.reply({
        content: replies.invalidSelf,
        ephemeral: true,
      });
      return;
    }

    if (user.last_given === today) {
      try {
        await interaction.reply({
          content: replies.invalidMax,
          ephemeral: true,
        });
      } catch (error) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description: `Discord Command Error (Star): ` + JSON.stringify(error),
        });
      }
      return;
    }

    try {
      await Bots.db
        ?.collection(Bots.env.MONGODB_STARS)
        .updateOne(
          { discord_id: user.discord_id },
          { $inc: { total_given: 1 }, $set: { last_given: today } }
        );

      await Bots.db
        ?.collection(Bots.env.MONGODB_STARS)
        .updateOne({ discord_id: recipient.id }, { $inc: { stars: 1 } });
    } catch (error) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Discord Database Error (Star): ` + JSON.stringify(error),
      });
    }

    const recipientName = recipient.globalName || recipient.username;

    const botEmbed = new EmbedBuilder()
      .setColor(CONFIG.COLORS.YELLOW as ColorResolvable)
      .setTitle(`${recipientName} got a star from ${userName}!`)
      .setDescription(
        `Endorse a community member by giving them a star! ${EMOJIS.STAR.EMBED}`
      );

    try {
      await interaction.reply({ embeds: [botEmbed] });
    } catch (error) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Discord Command Error (Star): ` + JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.STAR.NAME;
  },
};
