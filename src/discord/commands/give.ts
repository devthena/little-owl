import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotsProps } from 'src/interfaces';
import { UserObject } from 'src/schemas';
import { GIVE } from '../../configs';
import { CURRENCY } from '../../constants';
import { DiscordCommandName, LogEventType } from '../../enums';
import { getCurrency, logEvent } from '../../utils';

export const Give = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.Give)
    .setDescription('Give points to another user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Enter recipient username')
        .setRequired(true)
    )
    .addNumberOption(option =>
      option
        .setName('amount')
        .setDescription('Enter a specific amount to give')
        .setRequired(true)
    ),
  execute: async (
    Bots: BotsProps,
    interaction: CommandInteraction,
    user: UserObject,
    recipient: UserObject
  ) => {
    if (!GIVE.ENABLED) {
      try {
        await interaction.reply({
          content: 'Giving points is not enabled in this server.',
          ephemeral: true,
        });
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description: `Discord Command Error (Give): ` + JSON.stringify(err),
        });
        console.error(err);
      }
      return;
    }

    const amount = Number(interaction.options.get('amount')?.value) || 0;
    const replies = {
      invalidNegative: `You should give at least 1 ${CURRENCY.SINGLE}.`,
      invalidRecipient: `You can't give yourself ${CURRENCY.PLURAL}. :neutral_face:`,
      noPoints: `Sorry, you have no ${CURRENCY.SINGLE} to give. :neutral_face:`,
      notEnough: `Sorry, you don't have enough ${CURRENCY.PLURAL} to give. :neutral_face:`,
      success: `You gave ${
        recipient.discord_name || recipient.discord_username
      } ${amount} ${getCurrency(amount)}.`,
    };

    if (user.cash < 1) {
      try {
        await interaction.reply({ content: replies.noPoints, ephemeral: true });
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description: `Discord Command Error (Give): ` + JSON.stringify(err),
        });
        console.error(err);
      }
      return;
    }

    if (amount < 1) {
      try {
        await interaction.reply({
          content: replies.invalidNegative,
          ephemeral: true,
        });
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description: `Discord Command Error (Give): ` + JSON.stringify(err),
        });
        console.error(err);
      }
      return;
    }

    if (user.cash < amount) {
      try {
        await interaction.reply({
          content: replies.notEnough,
          ephemeral: true,
        });
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description: `Discord Command Error (Give): ` + JSON.stringify(err),
        });
        console.error(err);
      }
      return;
    }

    if (user.discord_id === recipient.discord_id) {
      try {
        await interaction.reply({
          content: replies.invalidRecipient,
          ephemeral: true,
        });
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description: `Discord Command Error (Give): ` + JSON.stringify(err),
        });
        console.error(err);
      }
      return;
    }

    try {
      await Bots.db
        ?.collection(Bots.env.MONGODB_USERS)
        .updateOne(
          { discord_id: recipient.discord_id },
          { $set: { cash: (recipient.cash += amount) } }
        );

      await Bots.db
        ?.collection(Bots.env.MONGODB_USERS)
        .updateOne(
          { discord_id: user.discord_id },
          { $set: { cash: (user.cash -= amount) } }
        );
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Discord Database Error (Give): ` + JSON.stringify(err),
      });
      console.error(err);
    }

    try {
      await interaction.reply({
        content: `${replies.success} Current balance: ${user.cash} :coin:`,
      });
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Discord Command Error (Give): ` + JSON.stringify(err),
      });
      console.error(err);
    }
  },
  getName: (): string => {
    return DiscordCommandName.Give;
  },
};
