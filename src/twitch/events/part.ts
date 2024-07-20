import { IGNORE_LIST } from '@/constants';
import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';

export const onPart = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _self: boolean
) => {
  if (IGNORE_LIST.includes(username)) return;

  Bots.log({
    type: LogCode.User,
    description: `${username} has left the chat.`,
  });
};
