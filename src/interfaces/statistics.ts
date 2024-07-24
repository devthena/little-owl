import { Document } from 'mongoose';

import { GameCode } from '@/enums/statistics';

export interface WordleObject {
  currentStreak: number;
  distribution: number[];
  maxStreak: number;
  totalPlayed: number;
  totalWon: number;
}

export interface StatsDocument extends Document {
  discord_id: string;
  [GameCode.Wordle]?: WordleObject;
}
