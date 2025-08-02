import { model, models, Schema } from 'mongoose';

import { GameCode } from '@/enums/games';
import { StatDocument } from '@/interfaces/stat';
import { getENV } from '@/lib/config';

const { MONGODB_STATS } = getENV();

const statSchema = new Schema<StatDocument>(
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

export const StatModel = models.Stat || model<StatDocument>('Stat', statSchema);
