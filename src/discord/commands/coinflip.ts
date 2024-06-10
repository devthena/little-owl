import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotsProps } from 'src/interfaces';
import { DiscordCommandName, LogEventType } from '../../enums';
import { logEvent, weightedRandom } from '../../utils';

export const CoinFlip = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.CoinFlip)
    .setDescription('Flip a coin!'),
  execute: async (Bots: BotsProps, interaction: CommandInteraction) => {
    const probability = { Heads: 0.5, Tails: 0.5 };
    const result = weightedRandom(probability);

    try {
      await interaction.reply(`You got... ${result}! :coin:`);
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Discord Command Error (CoinFlip): ` + JSON.stringify(err),
      });
      console.error(err);
    }
  },
  getName: (): string => {
    return DiscordCommandName.CoinFlip;
  },
};
