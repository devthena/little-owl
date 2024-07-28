import {
  ActionRowBuilder,
  ColorResolvable,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  InteractionReplyOptions,
  SlashCommandBuilder,
  SlashCommandStringOption,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';

import { CONFIG, COPY, EMOJIS } from '@/constants';
import { FoodItems } from '@/constants/items';

import { PetFood } from '@/enums/items';
import { LogCode } from '@/enums/logs';

import { BotsProps } from '@/interfaces/bot';
import { PetDocument } from '@/interfaces/pet';

import {
  getHappiness,
  getHealth,
  getHunger,
  increasePetHappiness,
} from '@/services/pet';
import { findOrCreateDiscordUser } from '@/services/user';
import { disablePreviousSelectMenu } from '../helpers';

export const Cerberus = {
  data: new SlashCommandBuilder()
    .setName(COPY.PET.NAME)
    .setDescription(COPY.PET.DESCRIPTION)
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName(COPY.PET.OPTION_NAME)
        .setDescription(COPY.PET.OPTION_DESCRIPTION)
        .setRequired(true)
        .addChoices([
          {
            name: 'status',
            value: 'status',
          },
          {
            name: 'pet',
            value: 'pet',
          },
          {
            name: 'feed',
            value: 'feed',
          },
        ])
    ),
  execute: async (
    Bots: BotsProps,
    interaction: CommandInteraction,
    pet: PetDocument
  ) => {
    if (!CONFIG.FEATURES.PET.ENABLED) {
      Bots.reply({
        content: COPY.DISABLED,
        ephimeral: true,
        interaction: interaction,
      });
      return;
    }

    const options = interaction.options as CommandInteractionOptionResolver;
    const action = options.getString(COPY.PET.OPTION_NAME);

    let hasSelectMenu = false;
    let replyOptions: InteractionReplyOptions = {};

    if (action === 'status') {
      const description = `${pet.name} is doing great! His hunger is fully satisfied, and he is in excellent health. Keep up the good work!`;
      const happinessLevel = getHappiness(pet.happiness);

      const botEmbed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.BLUE as ColorResolvable)
        .setTitle(`${pet.name} is feeling ${happinessLevel}`)
        .setDescription(
          `Here are the latest stats for Cerberus!\n\n   ${
            EMOJIS.PET.HEALTH
          }  -  ${getHealth(pet.health)}  -  **${pet.health}**\n\n   ${
            EMOJIS.PET.HUNGER
          }  -  ${getHunger(pet.hunger)}  -  **${pet.hunger}**\n\n   ${
            EMOJIS.PET.HAPPINESS
          }  -  ${happinessLevel}  -  **${pet.happiness}**\n\n${description}`
        );

      replyOptions.embeds = [botEmbed];
    } else if (action === 'pet') {
      const prevHappyLevel = getHappiness(pet.happiness);
      const updatedPet = await increasePetHappiness(pet, Bots.log);

      const botEmbed = new EmbedBuilder().setColor(
        CONFIG.COLORS.BLUE as ColorResolvable
      );

      // pet is alive
      if (updatedPet) {
        const newHappyLevel = getHappiness(updatedPet.happiness);

        let description = `Happiness level improved from "${prevHappyLevel}" to "${newHappyLevel}"`;

        if (prevHappyLevel === newHappyLevel) {
          description = `Happiness level remained the same at "${newHappyLevel}"`;
        }

        botEmbed.setTitle(`${interaction.user.displayName} pet ${pet.name}!`);
        botEmbed.setDescription(description);

        replyOptions.embeds = [botEmbed];
      } else {
        botEmbed.setTitle(`${pet.name} is Gone`);
        botEmbed.setDescription(
          'He needs to be revived with a Honey Cake or wait for his natural resurrection to bring him back to life.'
        );
      }
    } else if (action === 'feed') {
      // remove tracked previous interactions for user
      await disablePreviousSelectMenu(Bots, interaction);

      const foodOptions = [];
      const user = await findOrCreateDiscordUser(Bots.log, interaction.user);

      if (!user) {
        Bots.reply({
          content: COPY.ERROR.GENERIC,
          ephimeral: true,
          interaction: interaction,
        });
        return;
      } else if (pet.isAlive) {
        for (const food of FoodItems.values()) {
          let label = food.name;

          if (food.id === PetFood.HoneyCake) {
            label += ` (Max Hunger)`;
          } else {
            label += ` (+${food.value} Hunger)`;
          }

          foodOptions.push(
            new StringSelectMenuOptionBuilder()
              .setLabel(label)
              .setDescription(`Price: ${food.cost} Coins`)
              .setValue(food.id)
              .setEmoji(food.emoji)
          );
        }
      } else {
        const food = FoodItems.get(PetFood.HoneyCake);

        if (food) {
          foodOptions.push(
            new StringSelectMenuOptionBuilder()
              .setLabel(`${food.name} (Revive)`)
              .setDescription(`Price: ${food.cost} Coins`)
              .setValue(food.id)
              .setEmoji(food.emoji)
          );
        }
      }

      const botEmbed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.BLUE as ColorResolvable)
        .setDescription('Purchase a food item to feed Cerberus:');

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`${COPY.PET.SELECT_FEED_ID}:${interaction.user.id}`)
        .setPlaceholder('Select Food')
        .addOptions(foodOptions);

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        selectMenu
      );

      replyOptions.embeds = [botEmbed];
      replyOptions.components = [row];

      hasSelectMenu = true;
    }

    try {
      const message = await interaction.reply(replyOptions);
      if (hasSelectMenu) Bots.interactions.set(interaction.user.id, message.id);
    } catch (error) {
      Bots.log({
        type: LogCode.Error,
        description: JSON.stringify(error),
      });
    }
  },
  getName: (): string => {
    return COPY.PET.NAME;
  },
};
