import {
  CommandInteraction,
  Interaction,
  StringSelectMenuInteraction,
} from 'discord.js';

import { BotsProps } from '@/interfaces/bot';

import {
  handleCommandInteraction,
  handleSelectMenuInteraction,
} from '../helpers';

export const onInteractionCreate = async (
  Bots: BotsProps,
  interaction: Interaction
) => {
  if (interaction.isChatInputCommand()) {
    await handleCommandInteraction(Bots, interaction as CommandInteraction);
  } else if (interaction.isStringSelectMenu()) {
    await handleSelectMenuInteraction(
      Bots,
      interaction as StringSelectMenuInteraction
    );
  }
};
