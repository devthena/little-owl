import { Document } from 'mongoose';

import { GameCode } from '@/enums/games';
import { BlackjackStats, WordleStats } from '@/interfaces/games';

export interface StatDocument extends Document {
  discord_id: string;
  [GameCode.Blackjack]?: BlackjackStats;
  [GameCode.Wordle]?: WordleStats;
}
