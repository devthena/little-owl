import { PetFood } from '@/enums/items';
import { ItemDocument } from '@/interfaces/item';

export const FoodItems: Map<string, ItemDocument> = new Map();

FoodItems.set(PetFood.Bones, {
  id: PetFood.Bones,
  name: 'Bones',
  description:
    'A basic treat for Cerberus that slightly increases his hunger level.',
  value: 5,
  cost: 500,
  emoji: '🦴',
});

FoodItems.set(PetFood.HoneyCake, {
  id: PetFood.HoneyCake,
  name: 'Honey Cake',
  description:
    'A rare treat for Cerberus that fully restores his hunger and can revive him if needed.',
  value: 100,
  cost: 15000,
  emoji: '🍰',
});

FoodItems.set(PetFood.RawMeat, {
  id: PetFood.RawMeat,
  name: 'Raw Meat',
  description:
    'A hearty meal for Cerberus that significantly boosts his hunger level.',
  value: 15,
  cost: 1250,
  emoji: '🥩',
});
