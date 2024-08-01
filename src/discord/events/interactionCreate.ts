import {
  CommandInteraction,
  Interaction,
  StringSelectMenuInteraction,
} from 'discord.js';

import { BotState } from '@/interfaces/bot';

import {
  handleCommandInteraction,
  handleSelectMenuInteraction,
} from '../helpers';

export const onInteractionCreate = async (
  state: BotState,
  interaction: Interaction
) => {
  if (interaction.isChatInputCommand()) {
    await handleCommandInteraction(state, interaction as CommandInteraction);
  } else if (interaction.isStringSelectMenu()) {
    await handleSelectMenuInteraction(
      interaction as StringSelectMenuInteraction
    );
  }
};
