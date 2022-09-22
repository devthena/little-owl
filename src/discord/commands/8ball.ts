import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const responses = [
  'It is certain.',
  'It is decidedly so.',
  'Without a doubt.',
  'Yes - definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Most likely.',
  'For sure.',
  'Yes.',
  'Signs point to yes.',
  'Reply hazy, try again.',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Concentrate and ask again.',
  "Don't count on it.",
  'My reply is no.',
  'No.',
  'Outlook not so good',
  'Very doubtful.',
];

export const Magic8Ball = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Play a game of Magic 8 Ball')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Enter a question')
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction) => {
    const randomNum = Math.floor(Math.random() * responses.length);
    const answer = responses[randomNum];

    await interaction.reply(`:8ball: says.. ${answer}`);
  },
};
