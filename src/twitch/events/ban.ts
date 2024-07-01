import { BotsProps } from 'src/types';
import { LogEventType } from '../../enums';

export const onBan = async (
  Bots: BotsProps,
  channel: string,
  username: string,
  _reason: string
) => {
  Bots.log({
    type: LogEventType.Leave,
    description: `${username} has been banned from ${channel}!`,
  });

  try {
    await Bots.db
      ?.collection(Bots.env.MONGODB_USERS)
      .findOneAndDelete({ twitch_username: username });

    Bots.log({
      type: LogEventType.Deleted,
      description: `Record with username=${username} has been removed from collection ${Bots.env.MONGODB_USERS}.`,
      footer: `Twitch Username: ${username}`,
    });
  } catch (error) {
    const description = `Twitch Database Error (Ban):\nError deleting record with twitch_username=${username} from collection ${Bots.env.MONGODB_USERS}.`;

    Bots.log({
      type: LogEventType.Error,
      description: description + `\n\nDetails:\n${JSON.stringify(error)}`,
    });
  }
};
