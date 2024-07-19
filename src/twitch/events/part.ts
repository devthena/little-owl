import { IGNORE_LIST } from '@/constants';
import { LogEventType } from '@/enums';
import { BotsProps } from '@/types';

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
