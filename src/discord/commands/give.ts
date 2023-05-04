import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotsProps, DiscordUserProps } from 'src/interfaces';
import { CONFIG } from '../../constants';

export const Give = {
  data: new SlashCommandBuilder()
    .setName('give')
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
    user: DiscordUserProps,
    recipientData: DiscordUserProps
  ) => {
    if (!CONFIG.GIVE.ENABLED) {
      await interaction.reply({
        content: 'Giving points is not enabled in this server.',
        ephemeral: true,
      });
      return;
    }

    const amount = Number(interaction.options.get('amount')?.value) || 0;
    const replies = {
      invalidAmount: `Enter a specific amount to give.`,
      invalidLowerBound: `Amount must be at least 1.`,
      invalidRecipient: `Enter a valid recipient.`,
      noPoints: `Sorry, you have no ${CONFIG.CURRENCY.SINGLE} to give. :neutral_face:`,
      notEnough: `Sorry, you don't have that many ${CONFIG.CURRENCY.PLURAL} to give. :neutral_face:`,
      success: `You gave ${recipientData.discord_name} ${amount} ${CONFIG.CURRENCY.PLURAL}.`,
    };

    if (user.points < 1) {
      await interaction.reply({ content: replies.noPoints });
      return;
    }

    if (isNaN(amount)) {
      await interaction.reply({ content: replies.invalidAmount });
      return;
    }

    if (amount <= 0) {
      await interaction.reply({ content: replies.invalidLowerBound });
      return;
    }

    if (user.points < amount) {
      await interaction.reply({ content: replies.notEnough });
      return;
    }

    // @to-do: check if recipient goes will exceed max points before giving

    if (user.discord_id === recipientData.discord_id) {
      await interaction.reply({ content: replies.invalidRecipient });
      return;
    }

    await Bots.db?.collection(Bots.env.MONGODB_USERS).updateOne(
      {
        discord_id: recipientData.discord_id,
      },
      { $set: { points: (recipientData.points += amount) } },
      { upsert: true }
    );

    await Bots.db?.collection(Bots.env.MONGODB_USERS).updateOne(
      {
        discord_id: user.discord_id,
      },
      { $set: { points: (user.points -= amount) } },
      { upsert: true }
    );

    await interaction.reply({ content: replies.success });
    return;
  },
};
