import { CONFIG, COPY } from '@/constants';
import { IMAGES } from '@/constants/images';

import { log } from '@/discord/helpers';

import { PetFood } from '@/enums/items';
import { LogCode } from '@/enums/logs';

import { ItemDocument } from '@/interfaces/item';

import {
  PetDocument,
  PetHappiness,
  PetHealth,
  PetHunger,
} from '@/interfaces/pet';

import { PetModel } from '@/models/pet';

const {
  ADD_HAPPINESS,
  ADD_HEALTH,
  MAX_STATS,
  REVIVE_HAPPINESS,
  REVIVE_HEALTH,
} = CONFIG.FEATURES.PET;

export const createServerPet = async () => {
  if (!CONFIG.FEATURES.PET.ENABLED) return;

  try {
    const pet = await PetModel.findOne();
    if (pet) return;

    const newPet = new PetModel({ name: 'Cerberus' });
    await newPet.save();

    log({
      type: LogCode.Announce,
      title: `Welcome, ${newPet.name}!`,
      description: COPY.PET.NEW,
      image: IMAGES.PET.ALIVE,
    });
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const getHappiness = (value: number): PetHappiness => {
  if (value < 10) return 'Miserable';
  else if (value < 30) return 'Depressed';
  else if (value < 50) return 'Sad';
  else if (value < 60) return 'Bored';
  else if (value < 75) return 'Content';
  else if (value < 90) return 'Happy';
  else return 'Delighted';
};

export const getHealth = (value: number): PetHealth => {
  if (value < 10) return 'Dying';
  else if (value < 30) return 'Critical';
  else if (value < 50) return 'Weak';
  else if (value < 75) return 'Exhausted';
  else return 'Healthy';
};

export const getHunger = (value: number): PetHunger => {
  if (value < 25) return 'Starving';
  else if (value < 40) return 'Famished';
  else if (value < 60) return 'Hungry';
  else if (value < 75) return 'Peckish';
  else if (value < 90) return 'Satisfied';
  else return 'Full';
};

export const getServerPet = async (): Promise<PetDocument | null> => {
  try {
    return await PetModel.findOne();
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return null;
  }
};

export const increasePetHappiness = async (pet: PetDocument) => {
  try {
    if (pet.isAlive) {
      const newHappiness = pet.happiness + ADD_HAPPINESS;
      pet.happiness = newHappiness <= MAX_STATS ? newHappiness : MAX_STATS;
      await pet.save();
    }
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const increasePetHunger = async (
  pet: PetDocument,
  food: ItemDocument
) => {
  try {
    const now = new Date();

    if (pet.isAlive) {
      if (food.id === PetFood.HoneyCake) {
        pet.hunger = MAX_STATS;
      } else {
        const newHunger = pet.hunger + food.value;
        pet.hunger = newHunger <= MAX_STATS ? newHunger : MAX_STATS;
      }

      pet.last_fed = now;
      await pet.save();
    }
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const reviveServerPet = async (pet: PetDocument) => {
  try {
    const now = new Date();

    pet.isAlive = true;
    pet.happiness = REVIVE_HAPPINESS;
    pet.health = REVIVE_HEALTH;
    pet.hunger = MAX_STATS;
    pet.last_resurrected = now;

    await pet.save();
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const updatePetStatus = async () => {
  try {
    const pet = await PetModel.findOne();
    if (!pet) return;

    if (pet.isAlive) {
      if (pet.happiness > 0) pet.happiness -= 1;
      if (pet.hunger > 0) pet.hunger -= 1;

      // increase health depending on hunger level
      if (pet.health < MAX_STATS && pet.hunger > 80) {
        pet.health += ADD_HEALTH;
        if (pet.health > MAX_STATS) pet.health = MAX_STATS;
      }

      // decrease one extra happiness when hunger is low
      if (pet.hunger < 50) {
        if (pet.happiness > 0) pet.happiness -= 1;
      }

      // decrease one extra happiness when health is low
      if (pet.health < 50) {
        if (pet.happiness > 0) pet.happiness -= 1;
      }

      // decrease health depending on hunger or happiness level
      if (pet.hunger < 30 || pet.happiness < 10) {
        if (pet.health > 0) pet.health -= 1;
      }

      // decrease one extra health when hunger is 0
      if (pet.hunger === 0) {
        if (pet.health > 0) pet.health -= 1;
      }

      // decrease one extra health when happiness is 0
      if (pet.happiness === 0) {
        if (pet.health > 0) pet.health -= 1;
      }

      // check if pet has died after the latest updates
      if (pet.health === 0) {
        pet.isAlive = false;

        const now = new Date();
        const randomHours = Math.floor(Math.random() * 24) + 24;

        pet.resurrect_time = new Date(
          now.getTime() + randomHours * 60 * 60 * 1000
        );

        log({
          type: LogCode.Announce,
          title: `${pet.name} has Perished!`,
          description: COPY.PET.DEAD,
          image: IMAGES.PET.DEAD,
        });
      }

      await pet.save();
    } else {
      // check if pet needs to resurrect automatically
      const now = new Date();
      if (now >= pet.resurrect_time) {
        await reviveServerPet(pet);

        if (pet.isAlive) {
          log({
            type: LogCode.Announce,
            title: `${pet.name} has Returned!`,
            description: COPY.PET.ALIVE,
            image: IMAGES.PET.ALIVE,
          });
        }
      }
    }
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};
