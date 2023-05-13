import { BotsProps } from 'src/interfaces';
import { LogEventType, logEvent } from '../../utils';

export const onPart = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _self: boolean
) => {
  logEvent({
    Bots,
    type: LogEventType.User,
    description: `${username} has left the chat.`,
  });
};
