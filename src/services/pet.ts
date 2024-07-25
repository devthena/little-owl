import { COPY } from '@/constants';
import { IMAGES } from '@/constants/images';
import { LogCode } from '@/enums/logs';
import { PetModel } from '@/models/pet';

export const createServerPet = async (log: Function) => {
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

export const updatePetStatus = async (log: Function) => {
  try {
    const pet = await PetModel.findOne();
    if (!pet) return;

    if (pet.isAlive) {
      if (pet.happiness > 0) pet.happiness -= 1;
      if (pet.hunger > 0) pet.hunger -= 1;

      // decrease one extra happiness depending on hunger level
      if (pet.hunger < 30) {
        if (pet.happiness > 0) pet.happiness -= 1;
      }

      // decrease health depending on hunger and happiness level
      if (pet.hunger < 30 || pet.happiness < 10) {
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
          title: `${pet.name} Has Perished!`,
          description: COPY.PET.DEAD,
          image: IMAGES.PET.DEAD,
        });
      }
    } else {
      // check if pet needs to resurrect automatically
      const now = new Date();

      if (now >= pet.resurrect_time) {
        pet.happiness = 25;
        pet.hunger = 100;
        pet.health = 50;
        pet.isAlive = true;
        pet.last_resurrected = now;
      }
    }

    await pet.save();
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};
