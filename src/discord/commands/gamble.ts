import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { UserObject } from 'src/schemas';
import { BotsProps } from 'src/types';

import { CONFIG, COPY, EMOJIS } from '../../constants';
import { LogEventType } from '../../enums';
import { getCurrency, weightedRandom } from '../../lib';

export const Gamble = {
  data: new SlashCommandBuilder()
    .setName(COPY.GAMBLE.NAME)
    .setDescription(COPY.GAMBLE.DESCRIPTION)
    .addStringOption(option =>
      option
        .setName(COPY.GAMBLE.OPTION_NAME)
        .setDescription(COPY.GAMBLE.OPTION_DESCRIPTION)
        .setRequired(true)
    ),
  execute: async (
    Bots: BotsProps,
    interaction: CommandInteraction,
    user: UserObject
  ) => {
    if (!CONFIG.FEATURES.GAMBLE.ENABLED) {
      Bots.reply({
        content: COPY.DISABLED,
        ephimeral: true,
        interaction: interaction,
        source: COPY.GAMBLE.NAME,
      });
      return;
    }

    const replies = {
      invalidInput: 'Enter a specific amount, "all", or "half".',
      invalidNegative: `You should gamble at least 1 ${CONFIG.CURRENCY.SINGLE}.`,
      lostAll: `You lost all of your ${CONFIG.CURRENCY.PLURAL}. ${EMOJIS.GAMBLE.LOST}`,
      maxReached: `You can only gamble up to ${CONFIG.FEATURES.GAMBLE.LIMIT} ${CONFIG.CURRENCY.PLURAL}. ${EMOJIS.GAMBLE.INVALID}`,
      noPoints: `You have no ${CONFIG.CURRENCY.SINGLE} to gamble. ${EMOJIS.GAMBLE.INVALID}`,
      notEnough: `You don't have enough ${CONFIG.CURRENCY.PLURAL} to gamble that amount. ${EMOJIS.GAMBLE.INVALID}`,
    };

    if (user.cash < 1) {
      Bots.reply({
        content: replies.noPoints,
        ephimeral: true,
        interaction: interaction,
        source: COPY.GAMBLE.NAME,
      });
      return;
    }

    const arg = interaction.options.get('amount')?.value;
    const amount = typeof arg === 'string' ? parseInt(arg, 10) : 0;

    if (isNaN(amount) && arg !== 'all' && arg !== 'half') {
      Bots.reply({
        content: replies.invalidInput,
        ephimeral: true,
        interaction: interaction,
        source: COPY.GAMBLE.NAME,
      });
      return;
    }

    const isOverLimit = async (amount: number) => {
      if (amount > CONFIG.FEATURES.GAMBLE.LIMIT) {
        Bots.reply({
          content: replies.maxReached,
          ephimeral: true,
          interaction: interaction,
          source: COPY.GAMBLE.NAME,
        });
        return true;
      }
      return false;
    };

    const probability = {
      win: CONFIG.FEATURES.GAMBLE.WIN_PERCENT / 100,
      loss: 1 - CONFIG.FEATURES.GAMBLE.WIN_PERCENT / 100,
    };

    let points = user.cash;
    const result = weightedRandom(probability);

    if (arg === 'all') {
      if (await isOverLimit(points)) return;

      if (result === 'win') {
        points += user.cash;

        Bots.reply({
          content: `You won ${user.cash} ${getCurrency(user.cash)}! ${
            EMOJIS.GAMBLE.WIN
          } Current balance: ${points} ${EMOJIS.CURRENCY}`,
          ephimeral: false,
          interaction: interaction,
          source: COPY.GAMBLE.NAME,
        });
      } else {
        points = 0;

        Bots.reply({
          content: replies.lostAll,
          ephimeral: false,
          interaction: interaction,
          source: COPY.GAMBLE.NAME,
        });
      }
    } else if (arg === 'half') {
      const halfPoints = Math.round(user.cash / 2);
      if (await isOverLimit(halfPoints)) return;

      if (result === 'win') {
        points += halfPoints;

        Bots.reply({
          content: `You won ${halfPoints} ${getCurrency(halfPoints)}! ${
            EMOJIS.GAMBLE.WIN
          } Current balance: ${points} ${EMOJIS.CURRENCY}`,
          ephimeral: false,
          interaction: interaction,
          source: COPY.GAMBLE.NAME,
        });
      } else {
        points -= halfPoints;

        Bots.reply({
          content: `You lost ${halfPoints} ${getCurrency(halfPoints)}. ${
            EMOJIS.GAMBLE.LOST
          } Current balance: ${points} ${EMOJIS.CURRENCY}`,
          ephimeral: false,
          interaction: interaction,
          source: COPY.GAMBLE.NAME,
        });
      }
    } else if (amount < 1) {
      Bots.reply({
        content: replies.invalidNegative,
        ephimeral: true,
        interaction: interaction,
        source: COPY.GAMBLE.NAME,
      });
    } else if (amount <= user.cash) {
      if (await isOverLimit(amount)) return;

      if (result === 'win') {
        points += amount;

        Bots.reply({
          content: `You won ${amount} ${getCurrency(amount)}! ${
            EMOJIS.GAMBLE.WIN
          } Current balance: ${points} ${EMOJIS.CURRENCY}`,
          ephimeral: false,
          interaction: interaction,
          source: COPY.GAMBLE.NAME,
        });
      } else {
        points -= amount;

        Bots.reply({
          content: `You lost ${amount} ${getCurrency(amount)}. ${
            EMOJIS.GAMBLE.LOST
          } Current balance: ${points} ${EMOJIS.CURRENCY}`,
          ephimeral: false,
          interaction: interaction,
          source: COPY.GAMBLE.NAME,
        });
      }
    } else if (amount > user.cash) {
      Bots.reply({
        content: replies.notEnough,
        ephimeral: true,
        interaction: interaction,
        source: COPY.GAMBLE.NAME,
      });
      return;
    }

    try {
      await Bots.db
        ?.collection(Bots.env.MONGODB_USERS)
        .updateOne({ discord_id: user.discord_id }, { $set: { cash: points } });
    } catch (error) {
      Bots.log({
        type: LogEventType.Error,
        description:
          `Database Error (${COPY.GAMBLE.NAME}): ` + JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.GAMBLE.NAME;
  },
};
