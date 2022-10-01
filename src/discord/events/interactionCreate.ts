import { CommandInteraction } from 'discord.js';
import { BotsProps, DiscordUserProps } from 'src/interfaces';
import { Gamble } from '../commands';

export const onInteractionCreate = async (
  Bots: BotsProps,
  interaction: CommandInteraction
) => {
  if (interaction.isChatInputCommand()) {
    if (!interaction.member) {
      await interaction.reply('User does not exist.');
      return;
    }

    const document = await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .findOne({ discord_id: interaction.member.user.id });

    const discordTag = `${interaction.member.user.username}#${interaction.member.user.discriminator}`;

    const data: DiscordUserProps = {
      discord_id: interaction.member.user.id,
      discord_name: interaction.member.user.username,
      discord_tag: document ? document.discord_tag : discordTag,
      points: document ? document.points : 0,
    };

    if (interaction.commandName === 'gamble') {
      Gamble.execute(Bots, interaction, data);
    }
    return;
  }
};
