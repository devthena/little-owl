import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';

import { CONFIG, COPY } from '@/constants';
import { LogEventType } from '@/enums';
import { UserObject } from '@/interfaces/user';
import { deleteUser, setDiscordUser } from '@/services/user';
import { BotsProps } from '@/types';

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
    user: UserObject
  ) => {
    if (!CONFIG.FEATURES.LINK.ENABLED) {
      Bots.reply({
        content: COPY.DISABLED,
        ephimeral: true,
        interaction: interaction,
        source: COPY.LINK.NAME,
      });
      return;
    }

    const code = interaction.options.get('code')?.value;

    if (user.twitch_id) {
      Bots.reply({
        content: COPY.LINK.RESPONSES.LINKED_DISCORD,
        ephimeral: true,
        interaction: interaction,
        source: COPY.LINK.NAME,
      });
      return;
    }

    const userId = code?.toString();

    try {
      const twitchUser = await Bots.db
        ?.collection<UserObject>(Bots.env.MONGODB_USERS)
        .findOne({ user_id: userId });

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

      await setDiscordUser(Bots, interaction.user.id, {
        twitch_id: twitchUser.twitch_id,
        twitch_username: twitchUser.twitch_username,
        cash: points,
      });

      if (userId) await deleteUser(Bots, userId);

      await interaction.reply({
        content: COPY.LINK.RESPONSES.SUCCESS,
        ephemeral: true,
      });

      Bots.log({
        type: LogEventType.Activity,
        description: `${user.discord_username} aka ${user.discord_name} has linked their account: ${twitchUser.twitch_username}`,
      });
    } catch (error) {
      Bots.log({
        type: LogEventType.Error,
        description:
          `Discord Command Error (${COPY.LINK.NAME}): ` + JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.LINK.NAME;
  },
};
