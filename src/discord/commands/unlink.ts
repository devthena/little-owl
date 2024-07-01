import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';

import { v4 as uuidv4 } from 'uuid';

import { UserObject } from 'src/schemas';
import { BotsProps } from 'src/types';

import { CONFIG, COPY, INITIAL } from '../../constants';
import { LogEventType } from '../../enums';
import { addUser } from '../../lib/db';

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
      try {
        await interaction.reply({ content: COPY.DISABLED, ephemeral: true });
      } catch (error) {
        Bots.log({
          type: LogEventType.Error,
          description:
            `Discord Command Error (Unlink): ` + JSON.stringify(error),
        });
      }
      return;
    }

    const twitchName = interaction.options.get('username')?.value;

    try {
      if (!user.twitch_id) {
        await interaction.reply({
          content: COPY.UNLINK.RESPONSES.NOLINK,
          ephemeral: true,
        });
        return;
      }

      if (user.twitch_username !== twitchName) {
        await interaction.reply({
          content: COPY.UNLINK.RESPONSES.INVALID,
          ephemeral: true,
        });
        return;
      }

      const twitchData: UserObject = {
        ...INITIAL.USER,
        user_id: uuidv4(),
        twitch_id: user.twitch_id,
        twitch_username: user.twitch_username,
        cash: 0,
      };

      await addUser(Bots, twitchData);

      await Bots.db
        ?.collection(Bots.env.MONGODB_USERS)
        .updateOne(
          { discord_id: user.discord_id },
          { $set: { twitch_id: null, twitch_username: null } }
        );

      await interaction.reply({
        content: COPY.UNLINK.RESPONSES.SUCCESS,
        ephemeral: true,
      });

      Bots.log({
        type: LogEventType.Activity,
        description: `${user.discord_username} aka ${user.discord_name} has unlinked their account: ${user.twitch_username}`,
      });
    } catch (error) {
      Bots.log({
        type: LogEventType.Error,
        description:
          `Discord Command Error (AccountUnlink): ` + JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.UNLINK.NAME;
  },
};
