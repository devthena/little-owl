import { Interaction } from 'discord.js';

import { BotState } from '@/interfaces/bot';
import { handleCommandInteraction } from '../helpers';

export const onInteractionCreate = async (
  state: BotState,
  interaction: Interaction
) => {
  if (interaction.isChatInputCommand()) {
    await handleCommandInteraction(state, interaction);
  }
};
