import { GuildBan } from 'discord.js';
import { BotsProps } from 'src/interfaces';
import { logEvent } from '../../utils';


export const onGuildBanAdd = async (    
  Bots: BotsProps,
  guildBan: GuildBan
) => {

  const { user, reason } = guildBan;
  const reasonStr = reason? `\nReason: ${reason}`: '';

  logEvent({
    Bots,
    type: 'leave',
    description: `${user.tag} has been banned from the server.${reasonStr}`,
    footer: `Discord User ID: ${user.id}`,
  });

  await Bots.db?.collection(Bots.env.MONGODB_USERS).findOneAndDelete(
    { discord_id: user.id },
  ).then(()=> {
    logEvent({
        Bots,
        type: 'db|delete',
        description: `Record with discord_id=${user.tag} has been removed from collection ${Bots.env.MONGODB_USERS}.`,
        footer: `Discord User ID: ${user.id}`,
      });
  }).catch(() => {
    logEvent({
        Bots,
        type: 'db|error',
        description: `Error deleting record with discord_id=${user.tag} from collection ${Bots.env.MONGODB_USERS}.`,
        footer: `Discord User ID: ${user.id}`,
      });
  });

};
