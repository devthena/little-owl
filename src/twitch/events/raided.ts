import { BotsProps } from 'src/types';
import { LogEventType } from '../../enums';

export const onRaided = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  viewers: number
) => {
  Bots.log({
    type: LogEventType.Alert,
    description: `${username} has raided the chat with ${viewers} viewers!`,
  });
};
