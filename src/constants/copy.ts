import { CONFIG } from './config';
import { EMOJIS } from './emojis';
import { URLS } from './urls';

export const COPY = {
  DISABLED: 'This command is not enabled in the server.',
  BONUS: {
    NAME: 'bonus',
    DESCRIPTION: `[Admin] Bonus reward ${CONFIG.CURRENCY.PLURAL} to a user`,
    OPTION1_NAME: 'user',
    OPTION1_DESCRIPTION: '[Admin] Enter recipient username',
    OPTION2_NAME: 'amount',
    OPTION2_DESCRIPTION: '[Admin] Enter a specific amount to give',
  },
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
  ERROR: {
    EXPIRED: 'This interaction has expired.',
    GENERIC: 'Something went wrong. Please try again later.',
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
  HUG: {
    NAME: 'hug',
  },
  INFO: {
    discord: 'https://discord.gg/EMsfWqk',
    dstmods: 'https://steamcommunity.com/workshop/filedetails/?id=1783032105',
    steam: 'https://steamcommunity.com/id/AthenaUS',
    switch: 'SW-8136-7007-4521',
    bsky: 'https://bsky.app/profile/athenaus.io',
    web: 'https://parthenon.app',
  } as { [key: string]: string },
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
  LURK: {
    NAME: 'lurk',
  },
  PET: {
    NAME: 'cerberus',
    DESCRIPTION: 'Resident good boy of the AthenaUS server',
    OPTION_NAME: 'action',
    OPTION_DESCRIPTION: 'Interact with Cerberus!',
    SELECT_FEED_ID: 'cerberus-feed',
    ALIVE: `He has revived after a period of rest. He comes back with hunger fully restored, ready to watch over the server once more. ${EMOJIS.PET.PAW}\n\nYou can now resume earning coins ${EMOJIS.CURRENCY} and taking care of him.`,
    DEAD: `Revive him with Honey Cake or wait for his return in the next couple of days. Earning coins ${EMOJIS.CURRENCY} has halted until he is revived.`,
    FULL: '**Cerberus is currently Full**\nPlease check back later when he goes hungry again.',
    NEW: `Cerberus has arrived to guard and protect our server. Keep him well-fed and happy to continue earning ${CONFIG.CURRENCY.PLURAL}. ${EMOJIS.PET.PAW}`,
    REVIVED: `He has been revived, his hunger fully restored, and he is ready to protect the server once more. ${EMOJIS.PET.PAW}\n\nYou can now resume earning coins ${EMOJIS.CURRENCY} and taking care of him.`,
  },
  POINTS: {
    NAME: 'points',
    DESCRIPTION: `Display the amount of ${CONFIG.CURRENCY.PLURAL} you have`,
  },
  PROFILE: {
    NAME: 'profile',
    DESCRIPTION: 'Display your profile',
  },
  SLEEP: {
    NAME: 'sleep',
    DESCRIPTION: 'Sleep time for Little Owl',
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
