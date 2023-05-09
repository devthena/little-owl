import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { BotsProps, UserProps } from 'src/interfaces';
import { COMMAND_NAMES_DISCORD } from './constants';
import { CONFIG } from '../../constants';

// @todo: add error handling for await statements

export const Star = {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAMES_DISCORD.STAR)
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
    if (!CONFIG.STAR.ENABLED) {
      await interaction.reply({
        content: 'Giving stars is not enabled in this server.',
        ephemeral: true,
      });
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
    //   await interaction.reply({ content: replies.invalidMax, ephemeral: true });
    //   return;
    // }

    // await Bots.db
    //   ?.collection(Bots.env.MONGODB_ACTIVITIES_USER)
    //   .updateOne(
    //     { discord_id: user.discord_id },
    //     { $set: { last_star: today } }
    //   );

    await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .updateOne({ discord_id: recipient.discord_id }, { $inc: { stars: 1 } });

    const botEmbed = new EmbedBuilder()
      .setTitle(
        `${recipient.discord_username} got a star from ${user.discord_username}!`
      )
      .setDescription(
        'Give stars to members of the community as a form of endorsement! :sparkles:'
      )
      .setFooter({ text: `Star given on ${now}` });

    await interaction.reply({ embeds: [botEmbed] });
  },
  getName: (): string => {
    return COMMAND_NAMES_DISCORD.STAR;
  },
};
