import { ObjectId } from 'mongodb';

export interface BankObject {
  _id?: ObjectId;
  discord_id: string;
  balance: number;
  total_deposit: number;
  total_withdrawal: number;
}
