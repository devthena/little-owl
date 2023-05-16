import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { DiscordCommandName } from '../../enums';
import { weightedRandom } from '../../utils';

// @todo: add error handling for await statements

export const CoinFlip = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.CoinFlip)
    .setDescription('Flip a coin!'),
  execute: async (interaction: CommandInteraction) => {
    const probability = { Heads: 0.5, Tails: 0.5 };
    const result = weightedRandom(probability);

    await interaction.reply(`You got... ${result}! :coin:`);
  },
  getName: (): string => {
    return DiscordCommandName.CoinFlip;
  },
};
