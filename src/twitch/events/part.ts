import { IGNORE_LIST } from 'src/constants';
import { LogEventType } from 'src/enums';
import { BotsProps } from 'src/interfaces';
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
    type: LogEventType.User,
    description: `${username} has left the chat.`,
  });
};
