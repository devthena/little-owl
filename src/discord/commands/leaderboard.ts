import {
  ColorResolvable,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

import { CONFIG, COPY, EMOJIS } from '@/constants';
import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';
import { getUsersByCategory } from '@/services/user';

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
      });
      return;
    }

    const description = `Here are the users with the highest ${CONFIG.CURRENCY.PLURAL}!`;
    const leaderboardUsers = await getUsersByCategory(Bots.log, 'cash', 5);

    if (!leaderboardUsers.length) {
      return await interaction.reply({
        content: `Awkward.. it looks like nobody has any ${CONFIG.CURRENCY.SINGLE} right now.`,
        ephemeral: true,
      });
    }

    const botEmbed = new EmbedBuilder()
      .setTitle('Leaderboard')
      .setColor(CONFIG.COLORS.YELLOW as ColorResolvable);

    let content = '';
    leaderboardUsers.forEach((user, i) => {
      const name = user.discord_name || user.discord_username || '';

      switch (i) {
        case 0:
          content += `${i + 1}. ${name} ${EMOJIS.LEADERBOARD.FIRST}  •  ${
            user.cash
          }  ${EMOJIS.CURRENCY}\n`;
          break;
        case 1:
          content += `${i + 1}. ${name} ${EMOJIS.LEADERBOARD.SECOND}  •  ${
            user.cash
          }  ${EMOJIS.CURRENCY}\n`;
          break;
        case 2:
          content += `${i + 1}. ${name} ${EMOJIS.LEADERBOARD.THIRD}  •  ${
            user.cash
          }  ${EMOJIS.CURRENCY}\n`;
          break;
        default:
          content += `${i + 1}. ${name}  •  ${user.cash}  ${EMOJIS.CURRENCY}\n`;
      }
    });

    botEmbed.addFields({ name: description, value: content });

    try {
      await interaction.reply({ embeds: [botEmbed] });
    } catch (error) {
      Bots.log({
        type: LogCode.Error,
        description: JSON.stringify(error),
      });
    }
    return;
  },
  getName: (): string => {
    return COPY.LEADERBOARD.NAME;
  },
};
