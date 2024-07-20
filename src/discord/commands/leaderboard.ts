import {
  ColorResolvable,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

import { CONFIG, COPY, EMOJIS } from '@/constants';
import { LogEventType } from '@/enums';
import { UserObject } from '@/interfaces/user';
import { BotsProps } from '@/types';

export const Leaderboard = {
  data: new SlashCommandBuilder()
    .setName(COPY.LEADERBOARD.NAME)
    .setDescription(COPY.LEADERBOARD.DESCRIPTION),
  execute: async (Bots: BotsProps, interaction: CommandInteraction) => {
    if (!CONFIG.FEATURES.LEADERBOARD.ENABLED) {
      Bots.reply({
        content: COPY.DISABLED,
        ephimeral: true,
        interaction: interaction,
        source: COPY.LEADERBOARD.NAME,
      });
      return;
    }

    const description = `Here are the users with the highest ${CONFIG.CURRENCY.PLURAL}!`;

    const topUsers = await Bots.db
      ?.collection<UserObject>(Bots.env.MONGODB_USERS)
      .find({ discord_id: { $exists: true, $ne: null }, cash: { $gt: 0 } })
      .sort({ cash: -1 })
      .limit(5)
      .toArray();

    if (!topUsers) {
      return await interaction.reply({
        content: `Awkward.. it looks like nobody has any ${CONFIG.CURRENCY.SINGLE} right now.`,
        ephemeral: true,
      });
    }

    const botEmbed = new EmbedBuilder()
      .setTitle('Leaderboard')
      .setColor(CONFIG.COLORS.YELLOW as ColorResolvable);

    let content = '';
    topUsers.forEach((top, i) => {
      let name = top.discord_name?.length
        ? top.discord_name
        : top.discord_username || '';

      switch (i) {
        case 0:
          content += `${i + 1}. ${name} ${EMOJIS.LEADERBOARD.FIRST}  |  ${
            top.cash
          } ${EMOJIS.CURRENCY}\n`;
          break;
        case 1:
          content += `${i + 1}. ${name} ${EMOJIS.LEADERBOARD.SECOND}  |  ${
            top.cash
          } ${EMOJIS.CURRENCY}\n`;
          break;
        case 2:
          content += `${i + 1}. ${name} ${EMOJIS.LEADERBOARD.THIRD}  |  ${
            top.cash
          } ${EMOJIS.CURRENCY}\n`;
          break;
        default:
          content += `${i + 1}. ${name}  |  ${top.cash} ${EMOJIS.CURRENCY}\n`;
      }
    });

    botEmbed.addFields({ name: description, value: content });

    try {
      await interaction.reply({ embeds: [botEmbed] });
    } catch (error) {
      Bots.log({
        type: LogEventType.Error,
        description:
          `Discord Command Error (${COPY.LEADERBOARD.NAME}): ` +
          JSON.stringify(error),
      });
    }
    return;
  },
  getName: (): string => {
    return COPY.LEADERBOARD.NAME;
  },
};
