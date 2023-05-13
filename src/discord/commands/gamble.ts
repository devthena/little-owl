import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotsProps, UserProps } from 'src/interfaces';
import { COMMAND_NAMES_DISCORD } from './constants';
import { CONFIG } from '../../constants';
import { weightedRandom } from '../../utils';

// @todo: add error handling for await statements

export const Gamble = {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAMES_DISCORD.GAMBLE)
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
    if (!CONFIG.GAMES.GAMBLE.ENABLED) {
      await interaction.reply({
        content: 'Gambling is not enabled in this server.',
        ephemeral: true,
      });
      return;
    }

    const replies = {
      invalidInput: 'Enter a specific amount, "all", or "half".',
      invalidNegative: `You should gamble at least 1 ${CONFIG.CURRENCY.SINGLE}.`,
      lostAll: `You lost all of your ${CONFIG.CURRENCY.PLURAL}. :money_with_wings:`,
      noPoints: `You have no ${CONFIG.CURRENCY.SINGLE} to gamble.`,
      notEnough: `You don't have that much ${CONFIG.CURRENCY.PLURAL} to gamble.`,
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
      win: CONFIG.GAMES.GAMBLE.WIN_PERCENT / 100,
      loss: 1 - CONFIG.GAMES.GAMBLE.WIN_PERCENT / 100,
    };

    let points = user.cash;
    const result = weightedRandom(probability);

    if (arg === 'all') {
      if (result === 'win') {
        points += user.cash;
        await interaction.reply({
          content: `You won ${user.cash} ${CONFIG.CURRENCY.PLURAL}! :moneybag: Your cash balance: ${points} :coin:.`,
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
          content: `You won ${halfPoints} ${CONFIG.CURRENCY.PLURAL}! :moneybag: Your cash balance: ${points} :coin:.`,
        });
      } else {
        points -= halfPoints;
        await interaction.reply({
          content: `You lost ${halfPoints} ${CONFIG.CURRENCY.PLURAL}. :money_with_wings: Your cash balance: ${points} :coin:.`,
        });
      }
    } else if (amount <= user.cash) {
      if (result === 'win') {
        points += amount;
        await interaction.reply({
          content: `You won ${amount} ${CONFIG.CURRENCY.PLURAL}! :moneybag: Your cash balance: ${points} :coin:.`,
        });
      } else {
        points -= amount;
        await interaction.reply({
          content: `You lost ${amount} ${CONFIG.CURRENCY.PLURAL}. :money_with_wings: Your cash balance: ${points} :coin:.`,
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
    return COMMAND_NAMES_DISCORD.GAMBLE;
  },
};
