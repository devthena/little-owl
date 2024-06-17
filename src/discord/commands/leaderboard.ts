import {
  ColorResolvable,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { BotsProps } from 'src/interfaces';
import { DiscordCommandName, LogEventType } from '../../enums';
import { logEvent } from '../../utils';
import { COLORS, CURRENCY } from '../../constants';
import { UserObject } from 'src/schemas';

export const Leaderboard = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.Leaderboard)
    .setDescription('Display a leaderboard based on amount of coins'),
  execute: async (Bots: BotsProps, interaction: CommandInteraction) => {
    const description = `Here are the users with the highest ${CURRENCY.PLURAL}!`;

    const topUsers = await Bots.db
      ?.collection<UserObject>(Bots.env.MONGODB_USERS)
      .find({ discord_id: { $exists: true, $ne: null }, cash: { $gt: 0 } })
      .sort({ cash: -1 })
      .limit(5)
      .toArray();

    if (!topUsers) {
      return await interaction.reply({
        content: `Awkward.. it looks like nobody has any ${CURRENCY.SINGLE} right now.`,
        ephemeral: true,
      });
    }

    const botEmbed = new EmbedBuilder()
      .setTitle('Leaderboard')
      .setColor(COLORS.YELLOW as ColorResolvable);

    let content = '';
    topUsers.forEach((top, i) => {
      let name = top.discord_name?.length
        ? top.discord_name
        : top.discord_username || '';

      switch (i) {
        case 0:
          content += `${i + 1}. ${name} :first_place:  |  ${
            top.cash
          } :coin:\n\n`;
          break;
        case 1:
          content += `${i + 1}. ${name} :second_place:  |  ${
            top.cash
          } :coin:\n\n`;
          break;
        case 2:
          content += `${i + 1}. ${name} :third_place:  |  ${
            top.cash
          } :coin:\n\n`;
          break;
        default:
          content += `${i + 1}. ${name}  |  ${top.cash} :coin:\n\n`;
      }
    });

    botEmbed.addFields({
      name: description,
      value: content,
    });

    try {
      await interaction.reply({ embeds: [botEmbed] });
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description:
          `Discord Command Error (Leaderboard): ` + JSON.stringify(err),
      });
      console.error(err);
    }

    return;
  },
  getName: (): string => {
    return DiscordCommandName.Leaderboard;
  },
};
