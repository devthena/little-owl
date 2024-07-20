import { ObjectId } from 'mongodb';

export interface StarObject {
  _id?: ObjectId;
  discord_id: string;
  stars: number;
  last_given: string | null;
  total_given: number;
}
