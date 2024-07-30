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
import { IMAGES } from '@/constants/images';

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

    const lastFedDateTS = Math.floor(pet.last_fed.getTime() / 1000);
    const resurrectTimeTS = Math.floor(pet.resurrect_time.getTime() / 1000);

    let replyOptions: InteractionReplyOptions = {};

    const botEmbed = new EmbedBuilder().setColor(
      CONFIG.COLORS.BLUE as ColorResolvable
    );

    let happinessEmoji = EMOJIS.PET.HAPPY_HIGH;
    let healthEmoji = EMOJIS.PET.HEALTH_HIGH;
    let hungerEmoji = EMOJIS.PET.HUNGER_HIGH;

    if (action === 'status') {
      if (pet.isAlive) {
        const happinessLevel = getHappiness(pet.happiness);

        let description = `He was last fed at <t:${lastFedDateTS}:t> (<t:${lastFedDateTS}:R>).`;

        if (pet.health < 50) {
          healthEmoji = EMOJIS.PET.HEALTH_LOW;
        }

        if (pet.hunger < 50) {
          hungerEmoji = EMOJIS.PET.HUNGER_LOW;
          description += '\nConsider feeding him soon to keep him healthy!';
        } else {
          description += '\nGreat job keeping him well-fed!';
        }

        if (pet.happiness < 50) {
          happinessEmoji = EMOJIS.PET.HAPPY_LOW;
        } else if (pet.happiness < 60) {
          happinessEmoji = EMOJIS.PET.HAPPY_MID;
        }

        botEmbed.setTitle(`${pet.name} is feeling ${happinessLevel}`);
        botEmbed.setDescription(
          `Here are the latest stats for Cerberus!\n\n   ${healthEmoji}  -  ${getHealth(
            pet.health
          )}  -  **${pet.health}**\n\n   ${hungerEmoji}  -  ${getHunger(
            pet.hunger
          )}  -  **${
            pet.hunger
          }**\n\n   ${happinessEmoji}  -  ${happinessLevel}  -  **${
            pet.happiness
          }**\n\n${description}`
        );
      } else {
        botEmbed.setTitle(`${pet.name} is Gone`);
        botEmbed.setDescription(
          `He needs to be revived with a Honey Cake.\n\nYou can also wait for his natural resurrection <t:${resurrectTimeTS}:R>.`
        );
        botEmbed.setImage(IMAGES.PET.DEAD);
      }

      replyOptions.embeds = [botEmbed];
    } else if (action === 'pet') {
      // check for user cooldown
      if (Bots.cooldowns.cerberus.has(interaction.user.id)) {
        const now = Date.now();
        const timeEnd: Date = Bots.cooldowns.cerberus.get(interaction.user.id)!;
        const timeEndMS = timeEnd.getTime();
        const timeEndTS = Math.floor(timeEnd.getTime() / 1000);

        if (now < timeEndMS) {
          Bots.reply({
            content: `This command is in cooldown for you.\n\nPlease try again <t:${timeEndTS}:R>`,
            ephimeral: true,
            interaction: interaction,
          });
          return;
        }
      }

      if (pet.isAlive) {
        await increasePetHappiness(pet, Bots.log);

        if (pet.happiness < 50) {
          happinessEmoji = EMOJIS.PET.HAPPY_LOW;
        } else if (pet.happiness < 60) {
          happinessEmoji = EMOJIS.PET.HAPPY_MID;
        }

        botEmbed.setTitle(`${interaction.user.displayName} pet ${pet.name}!`);
        botEmbed.setDescription(
          `Happiness Level:\n\n${happinessEmoji}  -  ${getHappiness(
            pet.happiness
          )}  -  **${pet.happiness}**`
        );
      } else {
        botEmbed.setTitle(`${pet.name} is Gone`);
        botEmbed.setDescription(
          `He needs to be revived with a Honey Cake.\n\nYou can also wait for his natural resurrection <t:${resurrectTimeTS}:R>.`
        );
        botEmbed.setImage(IMAGES.PET.DEAD);
      }

      replyOptions.embeds = [botEmbed];

      // add 15-minute cooldown for user
      const cooldownDate = new Date(Date.now() + 15 * 60 * 1000);
      Bots.cooldowns.cerberus.set(interaction.user.id, cooldownDate);
    } else if (action === 'feed') {
      const foodOptions = [];
      const user = await findOrCreateDiscordUser(Bots.log, interaction.user);

      if (!user) {
        Bots.reply({
          content: COPY.ERROR.GENERIC,
          ephimeral: true,
          interaction: interaction,
        });
        return;
      } else if (pet.hunger === CONFIG.FEATURES.PET.MAX_STATS) {
        Bots.reply({
          content: COPY.PET.FULL,
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

      botEmbed.setDescription('Purchase a food item to feed Cerberus:');

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`${COPY.PET.SELECT_FEED_ID}:${interaction.user.id}`)
        .setPlaceholder('Select Food')
        .addOptions(foodOptions);

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        selectMenu
      );

      replyOptions.embeds = [botEmbed];
      replyOptions.components = [row];
    }

    try {
      await interaction.reply(replyOptions);
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
