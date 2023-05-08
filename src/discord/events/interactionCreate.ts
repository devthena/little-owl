import { CommandInteraction } from 'discord.js';
import { BotsProps, DiscordUserProps } from 'src/interfaces';
import {
  CoinFlip,
  EightBall,
  Gamble,
  Give,
  Help,
  Points,
  Star,
} from '../commands';

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
      discord_tag: document?.discord_tag || discordTag,
      last_star: document?.last_star || '',
      points: document?.points || 0,
      stars: document?.stars || 0,
    };

    if (interaction.commandName === CoinFlip.getName()) {
      CoinFlip.execute(interaction);
    } else if (interaction.commandName === EightBall.getName()) {
      EightBall.execute(interaction);
    } else if (interaction.commandName === Gamble.getName()) {
      Gamble.execute(Bots, interaction, data);
    } else if (interaction.commandName === Help.getName()) {
      Help.execute(interaction);
    } else if (interaction.commandName === Points.getName()) {
      Points.execute(interaction, data);
    }

    const recipient = interaction.options.getUser('user');

    if (!recipient) return;

    const recipientDoc = await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .findOne({ discord_id: recipient.id });

    const recipientTag = `${recipient.username}#${recipient.discriminator}`;

    const recipientData: DiscordUserProps = {
      discord_id: recipient.id,
      discord_name: recipient.username,
      discord_tag: recipientTag,
      points: recipientDoc?.points || 0,
      stars: recipientDoc?.stars || 0,
    };

    if (interaction.commandName === Give.getName()) {
      Give.execute(Bots, interaction, data, recipientData);
    } else if (interaction.commandName === Star.getName()) {
      Star.execute(Bots, interaction, data, recipientData);
    }

    return;
  }
};
