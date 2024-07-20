import { ObjectId } from 'mongodb';
import { ActivityCode } from '@/enums/activities';

export interface ActivityDocument {
  _id: ObjectId;
  discord_id: string;
  [ActivityCode.Bank]?: {
    last_deposit: string;
    total_deposits: number;
    last_withdraw: string;
    total_withdraws: number;
  };
  [ActivityCode.Gamble]?: {
    last_gamble: string;
    total_won: number;
    total_lost: number;
  };
  [ActivityCode.Star]?: {
    last_given: string;
    total_given: number;
  };
  [ActivityCode.Wordle]?: {
    last_played: string;
  };
}

export interface ActivityObject {
  [key: string]: string | number;
}

export type ActivityPayload = {
  [key in ActivityCode]?: ActivityObject;
};
