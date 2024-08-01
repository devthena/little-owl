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

export type PetHappiness =
  | 'Delighted'
  | 'Happy'
  | 'Content'
  | 'Bored'
  | 'Sad'
  | 'Depressed'
  | 'Miserable';

export type PetHunger =
  | 'Full'
  | 'Satisfied'
  | 'Peckish'
  | 'Hungry'
  | 'Famished'
  | 'Starving';

export type PetHealth = 'Healthy' | 'Exhausted' | 'Weak' | 'Critical' | 'Dying';
