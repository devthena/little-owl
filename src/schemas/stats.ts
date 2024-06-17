import { ObjectId } from 'mongodb';
import { WordleObject } from 'src/interfaces';
import { GameCode } from '../enums';

export interface StatsObject {
  _id?: ObjectId;
  user_id: string;
  code: GameCode;
  data: WordleObject;
}
