import {
  ColorResolvable,
  EmbedBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';

import { CONFIG, COPY } from '@/constants';
import { IMAGES } from '@/constants/images';
import { FoodItems } from '@/constants/items';

import { PetFood } from '@/enums/items';

import { BotsProps } from '@/interfaces/bot';
import { PetDocument } from '@/interfaces/pet';

import {
  getHunger,
  getServerPet,
  increasePetHunger,
  reviveServerPet,
} from '@/services/pet';

import { findOrCreateDiscordUser, setDiscordUser } from '@/services/user';
import { UserDocument } from '@/interfaces/user';

export const handleSelectMenuInteraction = async (
  Bots: BotsProps,
  interaction: StringSelectMenuInteraction
) => {
  if (interaction.user.bot) return;

  const selectMenuId = interaction.customId.split(':');
  const selectUserId = selectMenuId[1];

  if (interaction.user.id !== selectUserId) return;

  if (interaction.customId.startsWith(COPY.PET.SELECT_FEED_ID)) {
    const botEmbed = new EmbedBuilder().setColor(
      CONFIG.COLORS.BLUE as ColorResolvable
    );

    const selectedOption = interaction.values[0];
    const food = FoodItems.get(selectedOption);

    const pet = await getServerPet(Bots.log);

    if (!food || !pet) {
      botEmbed.setDescription(COPY.ERROR.GENERIC);

      await interaction.update({
        embeds: [botEmbed],
        components: [],
      });
      return;
    }

    let updatedPet: PetDocument | undefined;
    let updatedUser: UserDocument | null = null;

    const user = await findOrCreateDiscordUser(Bots.log, interaction.user);
    if (!user) return;

    if (food.cost > user.cash) {
      botEmbed.setDescription(
        `${COPY.ERROR.NOT_ENOUGH} to buy ${food.name}.\nWould you like to purchase a different item?`
      );

      await interaction.update({
        embeds: [botEmbed],
      });
      return;
    }

    updatedUser = await setDiscordUser(Bots.log, interaction.user.id, {
      cash: user.cash - food.cost,
    });

    if (!updatedUser) return;

    if (pet.isAlive) {
      const prevHungerLevel = getHunger(pet.hunger);
      updatedPet = await increasePetHunger(pet, food, Bots.log);

      if (!updatedPet) {
        botEmbed.setDescription(COPY.ERROR.GENERIC);
      } else {
        const newHungerLevel = getHunger(pet.hunger);
        let description = `Hunger level improved from "${prevHungerLevel}" to "${newHungerLevel}"`;

        if (prevHungerLevel === newHungerLevel) {
          description = `Hunger level remained the same at "${newHungerLevel}"`;
        }

        botEmbed.setTitle(
          `${interaction.user.displayName} has fed ${pet.name} some ${food.name}!`
        );
        botEmbed.setDescription(description);
      }
    } else if (selectedOption === PetFood.HoneyCake) {
      updatedPet = await reviveServerPet(pet, Bots.log);

      if (!updatedPet || !updatedPet.isAlive) {
        botEmbed.setDescription(COPY.ERROR.GENERIC);
      } else {
        botEmbed.setTitle(`${pet.name} has Returned!`);
        botEmbed.setDescription(
          'He has been brought back to life, with hunger fully restored, and he is ready to protect the server once more.'
        );
        botEmbed.setImage(IMAGES.PET.ALIVE);
      }
    }

    await interaction.update({
      embeds: [botEmbed],
      components: [],
    });
  }
};
