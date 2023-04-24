import { GuildMember } from 'discord.js';
import { BotsProps } from 'src/interfaces';
import { CONFIG } from '../../constants';
import { logEvent } from '../../utils';

export const onGuildMemberAdd = async (
  Bots: BotsProps,
  member: GuildMember
) => {
  const { ENABLED, ID } = CONFIG.ROLES.DEFAULT;

  if (!ENABLED) return;

  const welcomeRole = member.guild?.roles.cache.find(role => role.id === ID);

  if (!ID || !welcomeRole) return;
  if (member.roles.cache.some(roles => roles.id === ID)) return;

  member.roles.add(welcomeRole.id || ID).then(() => {
    logEvent({
      Bots,
      type: 'activity',
      description: `${member.user.tag} aka ${member.displayName} has joined the server.`,
      footer: `Discord User ID: ${member.id}`,
    });
  });
};
