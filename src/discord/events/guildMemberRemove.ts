import { GuildMember } from 'discord.js';

import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';

export const onGuildMemberRemove = async (
  Bots: BotsProps,
  member: GuildMember
) => {
  if (!member.guild?.available) return;

  Bots.log({
    type: LogCode.Leave,
    description: `${member.user.username} aka ${member.displayName} has left or has been kicked from the server.`,
    thumbnail: member.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${member.id}`,
  });
};
