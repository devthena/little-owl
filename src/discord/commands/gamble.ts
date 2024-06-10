import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotsProps } from 'src/interfaces';
import { UserObject } from 'src/schemas';
import { GAMBLE } from '../../configs';
import { CURRENCY } from '../../constants';
import { DiscordCommandName, LogEventType } from '../../enums';
import { logEvent, weightedRandom } from '../../utils';

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
    user: UserObject
  ) => {
    if (!GAMBLE.ENABLED) {
      try {
        await interaction.reply({
          content: 'Gambling is not enabled in this server.',
          ephemeral: true,
        });
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description: `Discord Command Error (Gamble): ` + JSON.stringify(err),
        });
        console.error(err);
      }
      return;
    }

    const replies = {
      invalidInput: 'Enter a specific amount, "all", or "half".',
      invalidNegative: `You should gamble at least 1 ${CURRENCY.SINGLE}.`,
      lostAll: `You lost all of your ${CURRENCY.PLURAL}. :money_with_wings:`,
      noPoints: `You have no ${CURRENCY.SINGLE} to gamble. :neutral_face:`,
      notEnough: `You don't have enough ${CURRENCY.PLURAL} to gamble. :neutral_face:`,
    };

    if (user.cash < 1) {
      try {
        await interaction.reply({ content: replies.noPoints, ephemeral: true });
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description: `Discord Command Error (Gamble): ` + JSON.stringify(err),
        });
        console.error(err);
      }
      return;
    }

    const arg = interaction.options.get('amount')?.value;
    const amount = typeof arg === 'string' ? parseInt(arg, 10) : 0;

    if (isNaN(amount) && arg !== 'all' && arg !== 'half') {
      try {
        await interaction.reply({
          content: replies.invalidInput,
          ephemeral: true,
        });
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description: `Discord Command Error (Gamble): ` + JSON.stringify(err),
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
          description: `Discord Command Error (Gamble): ` + JSON.stringify(err),
        });
        console.error(err);
      }
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

        try {
          await interaction.reply({
            content: `You won ${user.cash} ${CURRENCY.PLURAL}! :moneybag: Your cash balance: ${points} :coin:`,
          });
        } catch (err) {
          logEvent({
            Bots,
            type: LogEventType.Error,
            description:
              `Discord Command Error (Gamble): ` + JSON.stringify(err),
          });
          console.error(err);
        }
      } else {
        points = 0;

        try {
          await interaction.reply({ content: replies.lostAll });
        } catch (err) {
          logEvent({
            Bots,
            type: LogEventType.Error,
            description:
              `Discord Command Error (Gamble): ` + JSON.stringify(err),
          });
          console.error(err);
        }
      }
    } else if (arg === 'half') {
      const halfPoints = Math.round(user.cash / 2);

      if (result === 'win') {
        points += halfPoints;

        try {
          await interaction.reply({
            content: `You won ${halfPoints} ${CURRENCY.PLURAL}! :moneybag: Your cash balance: ${points} :coin:`,
          });
        } catch (err) {
          logEvent({
            Bots,
            type: LogEventType.Error,
            description:
              `Discord Command Error (Gamble): ` + JSON.stringify(err),
          });
          console.error(err);
        }
      } else {
        points -= halfPoints;

        try {
          await interaction.reply({
            content: `You lost ${halfPoints} ${CURRENCY.PLURAL}. :money_with_wings: Your cash balance: ${points} :coin:`,
          });
        } catch (err) {
          logEvent({
            Bots,
            type: LogEventType.Error,
            description:
              `Discord Command Error (Gamble): ` + JSON.stringify(err),
          });
          console.error(err);
        }
      }
    } else if (amount <= user.cash) {
      if (result === 'win') {
        points += amount;

        try {
          await interaction.reply({
            content: `You won ${amount} ${CURRENCY.PLURAL}! :moneybag: Your cash balance: ${points} :coin:`,
          });
        } catch (err) {
          logEvent({
            Bots,
            type: LogEventType.Error,
            description:
              `Discord Command Error (Gamble): ` + JSON.stringify(err),
          });
          console.error(err);
        }
      } else {
        points -= amount;

        try {
          await interaction.reply({
            content: `You lost ${amount} ${CURRENCY.PLURAL}. :money_with_wings: Your cash balance: ${points} :coin:`,
          });
        } catch (err) {
          logEvent({
            Bots,
            type: LogEventType.Error,
            description:
              `Discord Command Error (Gamble): ` + JSON.stringify(err),
          });
          console.error(err);
        }
      }
    } else if (amount > user.cash) {
      try {
        await interaction.reply({
          content: replies.notEnough,
          ephemeral: true,
        });
      } catch (err) {
        logEvent({
          Bots,
          type: LogEventType.Error,
          description: `Discord Command Error (Gamble): ` + JSON.stringify(err),
        });
        console.error(err);
      }
      return;
    }

    try {
      await Bots.db
        ?.collection(Bots.env.MONGODB_USERS)
        .updateOne({ discord_id: user.discord_id }, { $set: { cash: points } });
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Discord Database Error (Gamble): ` + JSON.stringify(err),
      });
      console.error(err);
    }
  },
  getName: (): string => {
    return DiscordCommandName.Gamble;
  },
};
