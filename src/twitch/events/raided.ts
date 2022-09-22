import { BotsProps } from 'src/constants';
import { logEvent } from '../../utils';

export const onRaided = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  viewers: number
) => {
  logEvent(
    Bots.discord,
    'alert',
    `${username} has raided the chat with ${viewers} viewers!`
  );
};
