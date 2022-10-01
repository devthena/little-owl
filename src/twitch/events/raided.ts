import { BotsProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onRaided = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  viewers: number
) => {
  logEvent(
    Bots,
    'alert',
    `${username} has raided the chat with ${viewers} viewers!`
  );
};
