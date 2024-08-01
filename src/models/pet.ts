import { model, Schema } from 'mongoose';

import { PetDocument } from '@/interfaces/pet';
import { getENV } from '@/lib/config';

const { MONGODB_PETS } = getENV();

const petSchema = new Schema<PetDocument>(
  {
    name: { type: String, required: true },
    happiness: { type: Number, required: true, default: 100 },
    hunger: { type: Number, required: true, default: 100 },
    health: { type: Number, required: true, default: 100 },
    isAlive: { type: Boolean, required: true, default: true },
    last_fed: { type: Date, required: true, default: () => new Date() },
    last_resurrected: { type: Date, required: true, default: () => new Date() },
    resurrect_time: { type: Date, required: true, default: () => new Date() },
  },
  { collection: MONGODB_PETS, versionKey: false }
);

export const PetModel = model<PetDocument>('Pet', petSchema);
