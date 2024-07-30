import {
  ColorResolvable,
  EmbedBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';

import { CONFIG, COPY, EMOJIS } from '@/constants';
import { IMAGES } from '@/constants/images';
import { FoodItems } from '@/constants/items';

import { PetFood } from '@/enums/items';
import { UserDocument } from '@/interfaces/user';

import {
  getHappiness,
  getHunger,
  getServerPet,
  increasePetHunger,
  reviveServerPet,
} from '@/services/pet';

import { findOrCreateDiscordUser, setDiscordUser } from '@/services/user';

export const handleSelectMenuInteraction = async (
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

    const pet = await getServerPet();

    if (!food || !pet) {
      botEmbed.setDescription(COPY.ERROR.GENERIC);

      await interaction.update({
        embeds: [botEmbed],
        components: [],
      });
      return;
    }

    let updatedUser: UserDocument | null = null;

    const user = await findOrCreateDiscordUser(interaction.user);
    if (!user) return;

    if (food.cost > user.cash) {
      const otherOptionText = pet.isAlive
        ? '\n\nWould you like to purchase a different item?'
        : '';

      botEmbed.setTitle('Not enough coins');
      botEmbed.setDescription(
        `You cannot afford to buy ${food.name}.${otherOptionText}`
      );

      await interaction.update({
        embeds: [botEmbed],
        components: pet.isAlive ? undefined : [],
      });
      return;
    }

    if (food.id === PetFood.Bones && pet.isAlive && pet.happiness < 50) {
      botEmbed.setTitle(`${pet.name} refused to eat ${food.name}`);
      botEmbed.setDescription(
        `He is feeling ${getHappiness(
          pet.happiness
        )} and would only accept specific foods.\n\nWould you like to purchase a different item?`
      );

      await interaction.update({
        embeds: [botEmbed],
      });
      return;
    }

    updatedUser = await setDiscordUser(interaction.user.id, {
      cash: user.cash - food.cost,
    });

    if (!updatedUser) return;

    if (pet.isAlive) {
      let hungerEmoji = EMOJIS.PET.HUNGER_HIGH;

      await increasePetHunger(pet, food);

      if (pet.hunger < 50) hungerEmoji = EMOJIS.PET.HUNGER_LOW;

      botEmbed.setTitle(
        `${interaction.user.displayName} fed ${pet.name} some ${food.name}!`
      );
      botEmbed.setDescription(
        `Hunger Level:\n\n${hungerEmoji}  -  ${getHunger(pet.hunger)}  -  **${
          pet.hunger
        }**`
      );
    } else if (selectedOption === PetFood.HoneyCake) {
      await reviveServerPet(pet);

      if (!pet.isAlive) {
        botEmbed.setDescription(COPY.ERROR.GENERIC);
      } else {
        botEmbed.setTitle(`${pet.name} has Returned!`);
        botEmbed.setDescription(COPY.PET.REVIVED);
        botEmbed.setImage(IMAGES.PET.ALIVE);
      }
    }

    await interaction.update({
      embeds: [botEmbed],
      components: [],
    });
  }
};
