import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';

import { BotsProps } from 'src/interfaces';
import { DiscordCommandName, LogEventType } from '../../enums';
import { logEvent } from '../../utils';

const COMMAND_DESCRIPTION = 'Play a game of Magic 8-Ball';
const COMMAND_OPTION = 'question';
const COMMAND_OPTION_DESCRIPTION = 'Enter your question.';
const COMMAND_RESPONSES = [
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

export const EightBall = {
  data: new SlashCommandBuilder()
    .setName(DiscordCommandName.EightBall)
    .setDescription(COMMAND_DESCRIPTION)
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName(COMMAND_OPTION)
        .setDescription(COMMAND_OPTION_DESCRIPTION)
        .setRequired(true)
    ),
  execute: async (Bots: BotsProps, interaction: CommandInteraction) => {
    const randomNum = Math.floor(Math.random() * COMMAND_RESPONSES.length);
    const answer = COMMAND_RESPONSES[randomNum];

    try {
      await interaction.reply(`:8ball: says.. ${answer}`);
    } catch (err) {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Discord Command Error (8Ball): ` + JSON.stringify(err),
      });
      console.error(err);
    }
  },
  getName: (): string => {
    return DiscordCommandName.EightBall;
  },
};
