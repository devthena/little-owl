import { model, Schema } from 'mongoose';

import { ActivityDocument } from '@/interfaces/activities';
import { getENV } from '@/lib/config';

const { MONGODB_ACTS } = getENV();

const activitySchema = new Schema<ActivityDocument>(
  {
    discord_id: { type: String, required: true },
    bank: {
      last_deposit: { type: String },
      total_deposits: { type: Number },
      last_withdraw: { type: String },
      total_withdraws: { type: Number },
    },
    gamble: {
      last_gamble: { type: String },
      total_won: { type: Number },
      total_lost: { type: Number },
    },
    star: {
      last_given: { type: String },
      total_given: { type: Number },
    },
    wordle: {
      last_played: { type: String },
    },
  },
  { collection: MONGODB_ACTS, versionKey: false }
);

export const ActivityModel = model<ActivityDocument>(
  'Activity',
  activitySchema
);
