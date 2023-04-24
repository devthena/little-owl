import { GuildMember } from 'discord.js';
import { BotsProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onGuildMemberRemove = async (
  Bots: BotsProps,
  member: GuildMember
) => {
  if (!member.guild?.available) return;

  logEvent({
    Bots,
    type: 'leave',
    description: `${member.user.tag} aka ${member.displayName} has left or has been kicked from the server.`,
    thumbnail: member.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${member.id}`,
  });
};
