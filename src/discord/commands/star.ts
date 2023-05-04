import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { BotsProps, DiscordUserProps } from 'src/interfaces';
import { CONFIG } from '../../constants';

export const Star = {
  data: new SlashCommandBuilder()
    .setName('star')
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
      invalidSelf: `You can't give yourself a star.`,
    };

    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    if (user.discord_id === recipient.discord_id) {
      await interaction.reply(replies.invalidSelf);
      return;
    }

    if (user.last_star === today) {
      await interaction.reply(replies.invalidMax);
      return;
    }

    try {
      const botEmbed = new EmbedBuilder()
        .setTitle('Daily Star Sent!')
        .setDescription(
          `${recipient.discord_name} got a star from ${user.discord_name}! :sparkles:`
        )
        .setFooter({ text: `Star given on ${now}` });

      await interaction.reply({ embeds: [botEmbed] });
    } catch (err) {
      console.error(err);
    }
  },
};
