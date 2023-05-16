import { GuildBan } from 'discord.js';
import { LogEventType } from 'src/enums';
import { BotsProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onGuildBanAdd = async (Bots: BotsProps, guildBan: GuildBan) => {
  const { user, reason } = guildBan;
  const reasonStr = reason ? `\nReason: ${reason}` : '';

  logEvent({
    Bots,
    type: LogEventType.Leave,
    description: `${user.username} has been banned from the server.${reasonStr}`,
    thumbnail: user.displayAvatarURL() || undefined,
    footer: `Discord User ID: ${user.id}`,
  });

  await Bots.db
    ?.collection(Bots.env.MONGODB_USERS)
    .findOneAndDelete({ discord_id: user.id })
    .then(() => {
      logEvent({
        Bots,
        type: LogEventType.Deleted,
        description: `Record with discord_id=${user.username} has been removed from collection ${Bots.env.MONGODB_USERS}.`,
        thumbnail: user.displayAvatarURL() || undefined,
        footer: `Discord User ID: ${user.id}`,
      });
    })
    .catch(() => {
      logEvent({
        Bots,
        type: LogEventType.Error,
        description: `Error deleting record with discord_id=${user.username} from collection ${Bots.env.MONGODB_USERS}.`,
        thumbnail: user.displayAvatarURL() || undefined,
        footer: `Discord User ID: ${user.id}`,
      });
    });
};
