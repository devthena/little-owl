import { BotsProps } from 'src/types';

import { IGNORE_LIST } from '../../constants';
import { LogEventType } from '../../enums';

export const onPart = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _self: boolean
) => {
  if (IGNORE_LIST.includes(username)) return;

  Bots.log({
    type: LogEventType.User,
    description: `${username} has left the chat.`,
  });
};
