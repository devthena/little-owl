import { PetFood } from '@/enums/items';

type ItemId = PetFood;

export interface ItemDocument {
  id: ItemId;
  name: string;
  description: string;
  value: number;
  cost: number;
  emoji: string;
}
