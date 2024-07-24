import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';

import { CONFIG, COPY } from '@/constants';
import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';
import { UserObject } from '@/interfaces/user';
import { createUser, setDiscordUser } from '@/services/user';

export const AccountUnlink = {
  data: new SlashCommandBuilder()
    .setName(COPY.UNLINK.NAME)
    .setDescription(COPY.UNLINK.DESCRIPTION)
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName(COPY.UNLINK.OPTION_NAME)
        .setDescription(COPY.UNLINK.OPTION_DESCRIPTION)
        .setRequired(true)
    ),
  execute: async (
    Bots: BotsProps,
    interaction: CommandInteraction,
    user: UserObject
  ) => {
    if (!CONFIG.FEATURES.UNLINK.ENABLED) {
      Bots.reply({
        content: COPY.DISABLED,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    if (!user.twitch_id) {
      Bots.reply({
        content: COPY.UNLINK.RESPONSES.NOLINK,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    const twitchName = interaction.options.get('username')?.value;

    if (user.twitch_username !== twitchName) {
      Bots.reply({
        content: COPY.UNLINK.RESPONSES.INVALID,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    await createUser(Bots, {
      twitch_id: user.twitch_id,
      twitch_username: user.twitch_username,
      cash: 0,
    });

    await setDiscordUser(Bots, interaction.user.id, {
      twitch_id: null,
      twitch_username: null,
    });

    await interaction.reply({
      content: COPY.UNLINK.RESPONSES.SUCCESS,
      ephemeral: true,
    });

    Bots.log({
      type: LogCode.Activity,
      description: `${user.discord_username} aka ${user.discord_name} has unlinked their account: ${user.twitch_username}`,
    });
  },
  getName: (): string => {
    return COPY.UNLINK.NAME;
  },
};
