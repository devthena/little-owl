import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';

import { v4 as uuidv4 } from 'uuid';

import { BotsProps } from 'src/interfaces';
import { UserObject } from 'src/schemas';
import { NEW_USER } from '../../constants';
import { DiscordCommandName, LogEventType } from '../../enums';
import { logEvent } from '../../utils';
import { addUser } from '../../utils/db';

const COMMAND_DESCRIPTION =
  'Unlink your accounts (All coins stay in your Discord account)';
const COMMAND_OPTION = 'username';
const COMMAND_OPTION_DESCRIPTION =
  'Enter the Twitch username you want to unlink';

export const AccountUnlink = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.AccountUnlink)
    .setDescription(COMMAND_DESCRIPTION)
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName(COMMAND_OPTION)
        .setDescription(COMMAND_OPTION_DESCRIPTION)
        .setRequired(true)
    ),
  execute: async (
    Bots: BotsProps,
    interaction: CommandInteraction,
    user: UserObject
  ) => {
    const replies = {
      mismatched:
        'The Twitch username you entered is not linked with your account.',
      noLinked: 'Your account is not linked to a Twitch account.',
      success: 'Success! Your accounts are not linked anymore.',
    };

    const twitchName = interaction.options.get('username')?.value;

    try {
      if (!user.twitch_id) {
        await interaction.reply({
          content: replies.noLinked,
          ephemeral: true,
        });
        return;
      }

      if (user.twitch_username !== twitchName) {
        await interaction.reply({
          content: replies.mismatched,
          ephemeral: true,
        });
        return;
      }

      const twitchData: UserObject = {
        ...NEW_USER,
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

      await interaction.reply({ content: replies.success, ephemeral: true });

      logEvent({
        Bots,
        type: LogEventType.Activity,
        description: `${user.discord_username} aka ${user.discord_name} has unlinked their account: ${user.twitch_username}`,
      });
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description:
          `Discord Command Error (AccountUnlink): ` + JSON.stringify(err),
      });
      console.error(err);
    }
  },
  getName: (): string => {
    return DiscordCommandName.AccountUnlink;
  },
};
