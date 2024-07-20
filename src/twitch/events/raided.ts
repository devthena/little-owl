import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';

export const onRaided = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  viewers: number
) => {
  Bots.log({
    type: LogCode.Alert,
    description: `${username} has raided the chat with ${viewers} viewers!`,
  });
};
