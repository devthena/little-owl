import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { BotsProps, DiscordUserProps } from 'src/interfaces';
import { COMMAND_NAMES_DISCORD } from './constants';
import { CONFIG } from '../../constants';

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
    user: DiscordUserProps,
    recipient: DiscordUserProps
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
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    if (user.discord_id === recipient.discord_id) {
      await interaction.reply({
        content: replies.invalidSelf,
        ephemeral: true,
      });
      return;
    }

    if (user.last_star === today) {
      await interaction.reply({ content: replies.invalidMax, ephemeral: true });
      return;
    }

    try {
      if (Bots.env.MONGODB_USERS.length) {
        await Bots.db?.collection(Bots.env.MONGODB_USERS).updateOne(
          { discord_id: user.discord_id },
          {
            $set: {
              discord_name: user.discord_name,
              discord_tag: user.discord_tag,
              last_star: today,
            },
          },
          { upsert: true }
        );

        await Bots.db?.collection(Bots.env.MONGODB_USERS).updateOne(
          { discord_id: recipient.discord_id },
          {
            $set: {
              discord_name: recipient.discord_name,
              discord_tag: recipient.discord_tag,
            },
            $inc: {
              stars: 1,
            },
          },
          { upsert: true }
        );
      }

      const botEmbed = new EmbedBuilder()
        .setTitle(
          `${recipient.discord_name} got a star from ${user.discord_name}!`
        )
        .setDescription(
          'Give stars to members of the community as a form of endorsement! :sparkles:'
        )
        .setFooter({ text: `Star given on ${now}` });

      await interaction.reply({ embeds: [botEmbed] });
    } catch (err) {
      console.error(err);
    }
  },
  getName: (): string => {
    return COMMAND_NAMES_DISCORD.STAR;
  },
};
