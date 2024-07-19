import { LogEventType } from '@/enums';
import { BotsProps } from '@/types';

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
