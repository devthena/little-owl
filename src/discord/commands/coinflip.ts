import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { weightedRandom } from '../../utils';

export const CoinFlip = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin!'),
  execute: async (interaction: CommandInteraction) => {
    const probability = { Heads: 0.5, Tails: 0.5 };
    const result = weightedRandom(probability);

    await interaction.reply(`You got... ${result}! :coin:`);
  },
};
