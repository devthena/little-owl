import { GuildMember } from 'discord.js';

import { BotsProps } from 'src/types';

import { CONFIG } from '../../constants';
import { LogEventType } from '../../enums';

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
      type: LogEventType.Activity,
      description: `${member.user.username} aka ${member.displayName} has joined the server.`,
      footer: `Discord User ID: ${member.id}`,
    });
  } catch (error) {
    const description = `Discord Event Error (guildMemberAdd):\nCannot add role for ${member.user.username} aka ${member.displayName}`;

    Bots.log({
      type: LogEventType.Error,
      description: description + `\n\nDetails:\n${JSON.stringify(error)}`,
    });
  }
};
