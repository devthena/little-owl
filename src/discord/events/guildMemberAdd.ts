import { GuildMember } from 'discord.js';
import { BotsProps } from 'src/interfaces';
import { DEFAULT_ROLE } from '../../config';
import { LogEventType } from '../../enums';
import { logEvent } from '../../utils';

export const onGuildMemberAdd = async (
  Bots: BotsProps,
  member: GuildMember
) => {
  if (!DEFAULT_ROLE.ENABLED) return;

  const welcomeRole = member.guild?.roles.cache.find(
    role => role.id === DEFAULT_ROLE.ID
  );

  if (!DEFAULT_ROLE.ID || !welcomeRole) return;
  if (member.roles.cache.some(roles => roles.id === DEFAULT_ROLE.ID)) return;

  try {
    await member.roles.add(welcomeRole.id || DEFAULT_ROLE.ID);

    logEvent({
      Bots,
      type: LogEventType.Activity,
      description: `${member.user.username} aka ${member.displayName} has joined the server.`,
      footer: `Discord User ID: ${member.id}`,
    });
  } catch (err) {
    const description = `Discord Event Error (guildMemberAdd):\nCannot add role for ${member.user.username} aka ${member.displayName}`;

    logEvent({
      Bots,
      type: LogEventType.Error,
      description: description + `\n\nDetails:\n${JSON.stringify(err)}`,
    });
  }
};
