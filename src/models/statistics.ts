import { model, Schema } from 'mongoose';

import { GameCode } from '@/enums/statistics';
import { StatsDocument } from '@/interfaces/statistics';
import { getENV } from '@/lib/config';

const { MONGODB_STATS } = getENV();

const statsSchema = new Schema<StatsDocument>(
  {
    discord_id: { type: String, default: null },
    [GameCode.Wordle]: {
      currentStreak: { type: Number, default: 0 },
      distribution: { type: [Number], default: [] },
      maxStreak: { type: Number, default: 0 },
      totalPlayed: { type: Number, default: 0 },
      totalWon: { type: Number, default: 0 },
    },
  },
  { collection: MONGODB_STATS, versionKey: false }
);

export const StatsModel = model<StatsDocument>('Stats', statsSchema);
