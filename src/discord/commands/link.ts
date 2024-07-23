import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';

import { CONFIG, COPY } from '@/constants';
import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';
import { UserDocument } from '@/interfaces/user';

import { deleteUser, getUserById, setDiscordUser } from '@/services/user';

export const AccountLink = {
  data: new SlashCommandBuilder()
    .setName(COPY.LINK.NAME)
    .setDescription(COPY.LINK.DESCRIPTION)
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName(COPY.LINK.OPTION_NAME)
        .setDescription(COPY.LINK.OPTION_DESCRIPTION)
        .setRequired(true)
    ),
  execute: async (
    Bots: BotsProps,
    interaction: CommandInteraction,
    user: UserDocument
  ) => {
    if (!CONFIG.FEATURES.LINK.ENABLED) {
      Bots.reply({
        content: COPY.DISABLED,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    const code = interaction.options.get('code')?.value;

    if (user.twitch_id) {
      Bots.reply({
        content: COPY.LINK.RESPONSES.LINKED_DISCORD,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    const userId = code?.toString();
    const twitchUser = userId ? await getUserById(Bots.log, userId) : null;

    if (!twitchUser) {
      await interaction.reply({
        content: COPY.LINK.RESPONSES.INVALID,
        ephemeral: true,
      });
      return;
    }

    if (twitchUser && twitchUser.discord_id) {
      await interaction.reply({
        content: COPY.LINK.RESPONSES.LINKED_TWITCH,
        ephemeral: true,
      });
      return;
    }

    let points = user.cash + twitchUser.cash;

    await setDiscordUser(Bots.log, interaction.user.id, {
      twitch_id: twitchUser.twitch_id,
      twitch_username: twitchUser.twitch_username,
      cash: points,
    });

    if (userId) await deleteUser(Bots.log, userId);

    await interaction.reply({
      content: COPY.LINK.RESPONSES.SUCCESS,
      ephemeral: true,
    });

    Bots.log({
      type: LogCode.Activity,
      description: `${user.discord_username} aka ${user.discord_name} has linked their Twitch account: ${twitchUser.twitch_username}`,
    });
  },
  getName: (): string => {
    return COPY.LINK.NAME;
  },
};
