import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotsProps, UserProps } from 'src/interfaces';
import { GIVE } from '../../configs';
import { CURRENCY } from '../../constants';
import { DiscordCommandName } from '../../enums';

// @todo: add error handling for await statements

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
    user: UserProps,
    recipient: UserProps
  ) => {
    if (!GIVE.ENABLED) {
      await interaction.reply({
        content: 'Giving points is not enabled in this server.',
        ephemeral: true,
      });
      return;
    }

    const amount = Number(interaction.options.get('amount')?.value) || 0;
    const replies = {
      invalidLowerBound: `Amount must be at least 1.`,
      invalidRecipient: `Enter a valid recipient.`,
      noPoints: `Sorry, you have no ${CURRENCY.SINGLE} to give. :neutral_face:`,
      notEnough: `Sorry, you don't have that many ${CURRENCY.PLURAL} to give. :neutral_face:`,
      success: `You gave ${recipient.discord_username} ${amount} ${CURRENCY.PLURAL}.`,
    };

    if (user.cash < 1) {
      await interaction.reply({ content: replies.noPoints, ephemeral: true });
      return;
    }

    if (amount < 1) {
      await interaction.reply({
        content: replies.invalidLowerBound,
        ephemeral: true,
      });
      return;
    }

    if (user.cash < amount) {
      await interaction.reply({ content: replies.notEnough, ephemeral: true });
      return;
    }

    if (user.discord_id === recipient.discord_id) {
      await interaction.reply({
        content: replies.invalidRecipient,
        ephemeral: true,
      });
      return;
    }

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

    await interaction.reply({
      content: `${replies.success}. Your cash balance: ${user.cash} :coin:`,
    });
    return;
  },
  getName: (): string => {
    return DiscordCommandName.Give;
  },
};
