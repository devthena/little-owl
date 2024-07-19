import { BankObject, StarObject, UserObject } from '@/schemas';

export const INITIAL = {
  BANK: {
    discord_id: '',
    balance: 0,
    total_deposit: 0,
    total_withdrawal: 0,
  } as BankObject,
  STAR: {
    discord_id: '',
    stars: 0,
    last_given: null,
    total_given: 0,
  } as StarObject,
  USER: {
    user_id: '',
    discord_id: null,
    discord_username: null,
    discord_name: null,
    twitch_id: null,
    twitch_username: null,
    cash: 500,
  } as UserObject,
};
