import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { BotsProps, UserProps } from 'src/interfaces';
import { STAR } from '../../configs';
import { DiscordCommandName, LogEventType } from '../../enums';
import { logEvent } from '../../utils';

export const Star = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.Star)
    .setDescription('Give a star to a user as a form of endorsement')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Tag the friend you want to give the star to')
        .setRequired(true)
    ),
  execute: async (
    Bots: BotsProps,
    interaction: CommandInteraction,
    user: UserProps,
    recipient: UserProps
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
    // const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    if (user.discord_id === recipient.discord_id) {
      await interaction.reply({
        content: replies.invalidSelf,
        ephemeral: true,
      });
      return;
    }

    // @todo: Use activity collection to determine and set last_star value

    // if (user.last_star === today) {
    //   try {
    //     await interaction.reply({
    //       content: replies.invalidMax,
    //       ephemeral: true,
    //     });
    //   } catch (err) {
    //     logEvent({
    //       Bots,
    //       type: LogEventType.Error,
    //       description: `Discord Command Error (Star): ` + JSON.stringify(err),
    //     });
    //     console.error(err);
    //   }
    //   return;
    // }

    try {
      // await Bots.db
      //   ?.collection(Bots.env.MONGODB_ACTIVITIES_USER)
      //   .updateOne(
      //     { discord_id: user.discord_id },
      //     { $set: { last_star: today } }
      //   );

      await Bots.db
        ?.collection(Bots.env.MONGODB_USERS)
        .updateOne(
          { discord_id: recipient.discord_id },
          { $inc: { stars: 1 } }
        );
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Discord Database Error (Star): ` + JSON.stringify(err),
      });
      console.error(err);
    }

    const botEmbed = new EmbedBuilder()
      .setTitle(
        `${recipient.discord_username} got a star from ${user.discord_username}!`
      )
      .setDescription(
        'Give stars to members of the community as a form of endorsement! :sparkles:'
      )
      .setFooter({ text: `Star given on ${now}` });

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
