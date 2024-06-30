import {
  ColorResolvable,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  User,
} from 'discord.js';

import { BotsProps } from 'src/interfaces';
import { StarObject } from 'src/schemas';

import { STAR } from '../../configs';
import { COLORS } from '../../constants';
import { DiscordCommandName, LogEventType } from '../../enums';
import { logEvent } from '../../utils';

export const Star = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.Star)
    .setDescription('Give a star as a form of endorsement')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Enter recipient name')
        .setRequired(true)
    ),
  execute: async (
    Bots: BotsProps,
    interaction: CommandInteraction,
    user: StarObject,
    userName: string,
    recipient: User
  ) => {
    if (!STAR.ENABLED) {
      try {
        await interaction.reply({
          content: 'Giving stars is not enabled in this server.',
          ephemeral: true,
        });
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description: `Discord Command Error (Star): ` + JSON.stringify(err),
        });
        console.error(err);
      }
      return;
    }

    const replies = {
      invalidMax: 'You can only give one star per day.',
      invalidSelf: `You can't give yourself a star. :neutral_face:`,
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
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description: `Discord Command Error (Star): ` + JSON.stringify(err),
        });
        console.error(err);
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
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Discord Database Error (Star): ` + JSON.stringify(err),
      });
      console.error(err);
    }

    const recipientName = recipient.globalName || recipient.username;

    const botEmbed = new EmbedBuilder()
      .setColor(COLORS.YELLOW as ColorResolvable)
      .setTitle(`${recipientName} got a star from ${userName}!`)
      .setDescription(
        'Endorse a community member by giving them a star! :sparkles:'
      );

    try {
      await interaction.reply({ embeds: [botEmbed] });
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Discord Command Error (Star): ` + JSON.stringify(err),
      });
      console.error(err);
    }
  },
  getName: (): string => {
    return DiscordCommandName.Star;
  },
};
