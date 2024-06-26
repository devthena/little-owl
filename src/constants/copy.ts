import { CONFIG } from './config';
import { URLS } from './urls';

export const COPY = {
  DISABLED: 'This command is not enabled in the server.',
  COINFLIP: {
    NAME: 'coinflip',
    DESCRIPTION: 'Flip a coin!',
  },
  COMMANDS: {
    NAME: 'commands',
  },
  EIGHTBALL: {
    NAME: '8ball',
    DESCRIPTION: 'Play a game of Magic 8-Ball',
    OPTION_NAME: 'question',
    OPTION_DESCRIPTION: 'Enter your question.',
    RESPONSES: [
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
    ],
  },
  GAMBLE: {
    NAME: 'gamble',
    DESCRIPTION: `Play your ${CONFIG.CURRENCY.PLURAL} for a chance to double it`,
    OPTION_NAME: 'amount',
    OPTION_DESCRIPTION: 'Enter a specific amount, "all" or "half"',
  },
  GIVE: {
    NAME: 'give',
    DESCRIPTION: `Give ${CONFIG.CURRENCY.PLURAL} to another user`,
    OPTION1_NAME: 'user',
    OPTION1_DESCRIPTION: 'Enter recipient username',
    OPTION2_NAME: 'amount',
    OPTION2_DESCRIPTION: 'Enter a specific amount to give',
  },
  HELP: {
    NAME: 'help',
    DESCRIPTION: 'Display official links for commands and FAQ',
  },
  LEADERBOARD: {
    NAME: 'leaderboard',
    DESCRIPTION: `Display a leaderboard based on amount of ${CONFIG.CURRENCY.PLURAL}`,
  },
  LINK: {
    NAME: 'link',
    DESCRIPTION: `Link your Twitch account to merge your ${CONFIG.CURRENCY.PLURAL}!`,
    OPTION_NAME: 'code',
    OPTION_DESCRIPTION: 'Enter the account link code',
    RESPONSES: {
      INVALID: `Invalid code. Login at ${URLS.HOME} via Twitch to get the right code.`,
      LINKED_TWITCH:
        'This Twitch account is already linked with another Discord account.',
      LINKED_DISCORD:
        'Your account is already linked with another Twitch account.',
      SUCCESS: 'Success! Your accounts are now linked.',
    },
  },
  POINTS: {
    NAME: 'points',
    DESCRIPTION: `Display the amount of ${CONFIG.CURRENCY.PLURAL} you have`,
  },
  STAR: {
    NAME: 'star',
    DESCRIPTION: 'Give a star as a form of endorsement',
    OPTION_NAME: 'user',
    OPTION_DESCRIPTION: 'Enter recipient username',
  },
  UNLINK: {
    NAME: 'unlink',
    DESCRIPTION: `Unlink your accounts (All ${CONFIG.CURRENCY.PLURAL} stay in your Discord account)`,
    OPTION_NAME: 'username',
    OPTION_DESCRIPTION: 'Enter the Twitch username you want to unlink',
    RESPONSES: {
      INVALID:
        'The Twitch username you entered is not linked with your account.',
      NOLINK: 'Your account is not linked to a Twitch account.',
      SUCCESS: 'Success! Your accounts are not linked anymore.',
    },
  },
};
