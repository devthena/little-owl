import { ObjectId } from 'mongodb';
import { ActivityCode } from 'src/enums';

interface BankObject {
  balance: number;
  total_deposit: string;
  total_withdrawal: string;
}

interface StarObject {
  stars: number;
  last_given: string;
  last_received: string;
  total_given: number;
}

export interface ActivitiesObject {
  _id?: ObjectId;
  discord_id: string;
  code: ActivityCode;
  data: BankObject | StarObject;
}
