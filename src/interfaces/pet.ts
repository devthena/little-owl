import { Document } from 'mongoose';

export interface PetDocument extends Document {
  name: string;
  happiness: number;
  health: number;
  hunger: number;
  isAlive: boolean;
  last_fed: Date;
  last_resurrected: Date;
  resurrect_time: Date;
}
