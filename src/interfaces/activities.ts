import { Document } from 'mongoose';

export interface BankActivity {
  last_deposit: string;
  total_deposits: number;
  last_withdraw: string;
  total_withdraws: number;
}

export interface GambleActivity {
  last_gamble: string;
  total_won: number;
  total_lost: number;
}

export interface StarActivity {
  last_given: string;
  total_given: number;
}

export interface WordleActivity {
  last_played: string;
}

export interface ActivityDocument extends Document {
  discord_id: string;
  bank?: BankActivity;
  gamble?: GambleActivity;
  star?: StarActivity;
  wordle?: WordleActivity;
}
