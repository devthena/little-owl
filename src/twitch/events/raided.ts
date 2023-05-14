import { BotsProps } from 'src/interfaces';
import { LogEventType, logEvent } from '../../utils';

export const onRaided = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  viewers: number
) => {
  logEvent({
    Bots,
    type: LogEventType.Alert,
    description: `${username} has raided the chat with ${viewers} viewers!`,
  });
};
