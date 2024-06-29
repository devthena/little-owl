import { StringObjectProps } from 'src/interfaces';

export const BOT_ACTIVITIES = [
  { name: 'with Chat', type: 0 },
  { name: 'keyboard clicks', type: 2 },
  { name: 'Athena VODs', type: 3 },
  { name: 'with a controller', type: 0 },
  { name: 'Athena sing', type: 2 },
  { name: 'you gamble points', type: 3 },
  { name: 'with fire', type: 0 },
  { name: 'video game music', type: 2 },
  { name: 'you succeed <3', type: 3 },
  { name: 'with 1s and 0s', type: 0 },
  { name: 'ambient sounds', type: 2 },
  { name: 'Athena code', type: 3 },
];

// @todo: Update hex colors to match new brand
export const COLORS: StringObjectProps = {
  BLUE: '#93C7FF',
  GREEN: '#2ECC71',
  ORANGE: '#E74C3C',
  PINK: '#FFBFFA',
  PURPLE: '#9B59B6',
  RED: '#E91E63',
  YELLOW: '#F1C40F',
};

export const CURRENCY = {
  EMOJI: ':coin:',
  PLURAL: 'coins',
  SINGLE: 'coin',
};

export const GAMBLE_LIMIT = 10000;

export const IGNORE_LIST = [
  'commanderroot',
  'nightbot',
  'streamelements',
  'streamlabs',
];

// @todo: Update the status colors to match all log events
export const STATUS_COLORS: StringObjectProps = {
  BAN: COLORS.RED,
  DEFAULT: COLORS.BLUE,
  DELETE: COLORS.RED,
  JOIN: COLORS.GREEN,
  LEAVE: COLORS.YELLOW,
};

export const TWITCH_GAMBLE_EMOTES = {
  WIN: 'PopNemo',
  LOST: 'TearGlove',
  MAX: 'GivePLZ',
};

export const NEW_USER = {
  user_id: null,
  discord_id: null,
  discord_username: null,
  discord_name: null,
  twitch_id: null,
  twitch_username: null,
  cash: 500,
};
