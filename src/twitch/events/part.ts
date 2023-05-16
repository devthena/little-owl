import { BotsProps } from 'src/interfaces';
import { IGNORE_LIST } from '../../constants';
import { LogEventType } from '../../enums';
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
