import { ObjectId } from 'mongodb';
import { WordleObject } from 'src/interfaces';
import { GameCode } from '../enums';

export interface StatsObject {
  _id?: ObjectId;
  discord_id: string;
  code: GameCode;
  data: WordleObject;
}
