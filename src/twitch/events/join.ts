import { IGNORE_LIST } from '@/constants';
import { log } from '@/discord/helpers';
import { LogCode } from '@/enums/logs';

export const onJoin = async (
  _channel: string,
  username: string,
  self: boolean
) => {
  if (self) return console.log('* Twitch LittleOwl is online *');
  if (IGNORE_LIST.includes(username)) return;

  log({
    type: LogCode.User,
    description: `${username} has joined the chat.`,
  });
};
