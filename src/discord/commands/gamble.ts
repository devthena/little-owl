import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { GAMBLE } from 'src/configs';
import { CURRENCY } from 'src/constants';
import { DiscordCommandName } from 'src/enums';
import { BotsProps, UserProps } from 'src/interfaces';
import { weightedRandom } from '../../utils';

// @todo: add error handling for await statements

export const Gamble = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.Gamble)
    .setDescription('Play your points for a chance to double it')
    .addStringOption(option =>
      option
        .setName('amount')
        .setDescription('Enter a specific amount, "all" or "half"')
        .setRequired(true)
    ),
  execute: async (
    Bots: BotsProps,
    interaction: CommandInteraction,
    user: UserProps
  ) => {
    if (!GAMBLE.ENABLED) {
      await interaction.reply({
        content: 'Gambling is not enabled in this server.',
        ephemeral: true,
      });
      return;
    }

    const replies = {
      invalidInput: 'Enter a specific amount, "all", or "half".',
      invalidNegative: `You should gamble at least 1 ${CURRENCY.SINGLE}.`,
      lostAll: `You lost all of your ${CURRENCY.PLURAL}. :money_with_wings:`,
      noPoints: `You have no ${CURRENCY.SINGLE} to gamble.`,
      notEnough: `You don't have that much ${CURRENCY.PLURAL} to gamble.`,
    };

    if (user.cash < 1) {
      await interaction.reply({ content: replies.noPoints });
      return;
    }

    const arg = interaction.options.get('amount')?.value;

    if (!arg) {
      await interaction.reply({
        content: 'Missing argument for Gamble command.',
        ephemeral: true,
      });
      return;
    }

    const amount = typeof arg === 'string' ? parseInt(arg, 10) : 0;

    if (isNaN(amount) && arg !== 'all' && arg !== 'half') {
      await interaction.reply({
        content: replies.invalidInput,
        ephemeral: true,
      });
      return;
    }

    if (amount < 1) {
      await interaction.reply({
        content: replies.invalidNegative,
        ephemeral: true,
      });
      return;
    }

    const probability = {
      win: GAMBLE.WIN_PERCENT / 100,
      loss: 1 - GAMBLE.WIN_PERCENT / 100,
    };

    let points = user.cash;
    const result = weightedRandom(probability);

    if (arg === 'all') {
      if (result === 'win') {
        points += user.cash;
        await interaction.reply({
          content: `You won ${user.cash} ${CURRENCY.PLURAL}! :moneybag: Your cash balance: ${points} :coin:`,
        });
      } else {
        points = 0;
        await interaction.reply({ content: replies.lostAll });
      }
    } else if (arg === 'half') {
      const halfPoints = Math.round(user.cash / 2);

      if (result === 'win') {
        points += halfPoints;
        await interaction.reply({
          content: `You won ${halfPoints} ${CURRENCY.PLURAL}! :moneybag: Your cash balance: ${points} :coin:`,
        });
      } else {
        points -= halfPoints;
        await interaction.reply({
          content: `You lost ${halfPoints} ${CURRENCY.PLURAL}. :money_with_wings: Your cash balance: ${points} :coin:`,
        });
      }
    } else if (amount <= user.cash) {
      if (result === 'win') {
        points += amount;
        await interaction.reply({
          content: `You won ${amount} ${CURRENCY.PLURAL}! :moneybag: Your cash balance: ${points} :coin:`,
        });
      } else {
        points -= amount;
        await interaction.reply({
          content: `You lost ${amount} ${CURRENCY.PLURAL}. :money_with_wings: Your cash balance: ${points} :coin:`,
        });
      }
    } else if (amount > user.cash) {
      await interaction.reply({
        content: replies.notEnough,
        ephemeral: true,
      });
      return;
    }

    await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .updateOne({ discord_id: user.discord_id }, { $set: { cash: points } });
  },
  getName: (): string => {
    return DiscordCommandName.Gamble;
  },
};
