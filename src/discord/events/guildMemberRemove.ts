import { GuildMember } from 'discord.js';
import { BotsProps } from 'src/types';
import { LogEventType } from '../../enums';

export const onGuildMemberRemove = async (
  Bots: BotsProps,
  member: GuildMember
) => {
  if (!member.guild?.available) return;

  Bots.log({
    type: LogEventType.Leave,
    description: `${member.user.username} aka ${member.displayName} has left or has been kicked from the server.`,
    thumbnail: member.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${member.id}`,
  });
};
