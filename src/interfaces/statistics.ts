import { GameCode } from '@/enums/statistics';
import { ObjectId } from 'mongodb';

export interface StatsDocument {
  _id: ObjectId;
  discord_id: string;
  [GameCode.Wordle]?: WordleObject;
}

export interface WordleObject {
  currentStreak: number;
  distribution: number[];
  maxStreak: number;
  totalPlayed: number;
  totalWon: number;
}
