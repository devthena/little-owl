import { IGNORE_LIST } from '@/constants';
import { log } from '@/discord/helpers';
import { LogCode } from '@/enums/logs';

export const onPart = (_channel: string, username: string, _self: boolean) => {
  if (IGNORE_LIST.includes(username)) return;

  log({
    type: LogCode.User,
    description: `${username} has left the chat.`,
  });
};
