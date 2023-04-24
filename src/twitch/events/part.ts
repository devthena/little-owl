import { BotsProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onPart = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _self: boolean
) => {
  logEvent({
    Bots,
    type: 'user',
    description: `${username} has left the chat.`,
  });
};
