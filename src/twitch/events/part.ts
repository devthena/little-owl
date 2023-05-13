import { BotsProps } from 'src/interfaces';
import { IGNORE_LIST } from '../../constants';
import { logEvent } from '../../utils';

export const onPart = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _self: boolean
) => {
  if (IGNORE_LIST.includes(username)) return;

  logEvent({
    Bots,
    type: 'user',
    description: `${username} has left the chat.`,
  });
};
