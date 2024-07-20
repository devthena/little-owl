import { GuildMember } from 'discord.js';

import { CONFIG } from '@/constants';
import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';

export const onGuildMemberAdd = async (
  Bots: BotsProps,
  member: GuildMember
) => {
  if (!CONFIG.ROLES.DEFAULT.ENABLED || !CONFIG.ROLES.DEFAULT.ID) return;

  const welcomeRole = member.guild?.roles.cache.find(
    role => role.id === CONFIG.ROLES.DEFAULT.ID
  );

  if (
    !welcomeRole ||
    member.roles.cache.some(roles => roles.id === CONFIG.ROLES.DEFAULT.ID)
  )
    return;

  try {
    await member.roles.add(welcomeRole.id || CONFIG.ROLES.DEFAULT.ID);

    Bots.log({
      type: LogCode.Activity,
      description: `${member.user.username} aka ${member.displayName} has joined the server.`,
      footer: `Discord User ID: ${member.id}`,
    });
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};
