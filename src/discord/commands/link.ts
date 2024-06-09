import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';

import { BotsProps } from 'src/interfaces';
import { UserObject } from 'src/schemas';
import { DiscordCommandName, LogEventType } from '../../enums';
import { logEvent } from '../../utils';

const COMMAND_DESCRIPTION = 'Link your Twitch account to merge your coins!';
const COMMAND_OPTION = 'code';
const COMMAND_OPTION_DESCRIPTION = 'Enter the account link code';

export const AccountLink = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.AccountLink)
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
      invalidCode:
        'Invalid code. Login at https://parthenon.app via Twitch to get the right code.',
      isLinkedTwitch:
        'This Twitch account is already linked with another Discord account.',
      isLinkedDiscord:
        'Your account is already linked with another Twitch account.',
      success: 'Success! Your accounts are now linked.',
    };

    const code = interaction.options.get('code')?.value;

    try {
      if (user.twitch_id) {
        await interaction.reply({
          content: replies.isLinkedDiscord,
          ephemeral: true,
        });
        return;
      }

      const twitchUser = await Bots.db
        ?.collection<UserObject>(Bots.env.MONGODB_USERS)
        .findOne({ user_id: code?.toString() });

      if (!twitchUser) {
        await interaction.reply({
          content: replies.invalidCode,
          ephemeral: true,
        });
        return;
      }

      if (twitchUser && twitchUser.discord_id) {
        await interaction.reply({
          content: replies.isLinkedTwitch,
          ephemeral: true,
        });
        return;
      }

      let points = user.cash + twitchUser.cash;

      await Bots.db?.collection(Bots.env.MONGODB_USERS).updateOne(
        { discord_id: user.discord_id },
        {
          $set: {
            twitch_id: twitchUser.twitch_id,
            twitch_username: twitchUser.twitch_username,
            cash: points,
          },
        }
      );

      await Bots.db
        ?.collection(Bots.env.MONGODB_USERS)
        .deleteOne({ user_id: code });

      await interaction.reply({ content: replies.success, ephemeral: true });
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description:
          `Discord Command Error (AccountLink): ` + JSON.stringify(err),
      });
      console.error(err);
    }
  },
  getName: (): string => {
    return DiscordCommandName.AccountLink;
  },
};
