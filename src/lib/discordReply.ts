import { BotsProps, ReplyProps } from 'src/types';
import { LogEventType } from '../enums';

export const discordReply = async (
  Bots: BotsProps,
  { content, ephimeral, interaction, source }: ReplyProps
) => {
  try {
    await interaction.reply({ content: content, ephemeral: ephimeral });
  } catch (error) {
    Bots.log({
      type: LogEventType.Error,
      description: `Discord Reply Error (${source}): ` + JSON.stringify(error),
    });
  }
};
