import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotsProps, DiscordUserProps } from 'src/interfaces';
import { COMMAND_NAMES_DISCORD } from './constants';
import { CONFIG } from '../../constants';
import { weightedRandom } from '../../utils';

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
    user: DiscordUserProps
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

    if (user.points < 1) {
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

    let updates = { points: user.points };
    const result = weightedRandom(probability);

    if (arg === 'all') {
      if (result === 'win') {
        updates.points += user.points;
        await interaction.reply({
          content: `You won ${user.points} ${CONFIG.CURRENCY.PLURAL}! :moneybag:`,
        });
      } else {
        updates.points = 0;
        await interaction.reply({ content: replies.lostAll });
      }
    } else if (arg === 'half') {
      const halfPoints = Math.round(user.points / 2);

      if (result === 'win') {
        updates.points += halfPoints;
        await interaction.reply({
          content: `You won ${halfPoints} ${CONFIG.CURRENCY.PLURAL}! :moneybag:`,
        });
      } else {
        updates.points -= halfPoints;
        await interaction.reply({
          content: `You lost ${halfPoints} ${CONFIG.CURRENCY.PLURAL}. :money_with_wings:`,
        });
      }
    } else if (amount <= user.points) {
      if (result === 'win') {
        updates.points += amount;
        await interaction.reply({
          content: `You won ${amount} ${CONFIG.CURRENCY.PLURAL}! :moneybag:`,
        });
      } else {
        updates.points -= amount;
        await interaction.reply({
          content: `You lost ${amount} ${CONFIG.CURRENCY.PLURAL}. :money_with_wings:`,
        });
      }
    } else if (amount > user.points) {
      await interaction.reply({
        content: replies.notEnough,
        ephemeral: true,
      });
      return;
    }

    if (process.env.MONGODB_USERS) {
      await Bots.db
        ?.collection(process.env.MONGODB_USERS)
        .updateOne(
          { discord_id: user.discord_id },
          { $set: { ...updates } },
          { upsert: true }
        );
    }
  },
  getName: (): string => {
    return COMMAND_NAMES_DISCORD.GAMBLE;
  },
};
