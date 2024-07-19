import { IGNORE_LIST } from '@/constants';
import { LogEventType } from '@/enums';
import { BotsProps } from '@/types';

export const onJoin = async (
  Bots: BotsProps,
  _channel: string,
  username: string,
  self: boolean
) => {
  if (self) return console.log('* Twitch LittleOwl is online *');
  if (IGNORE_LIST.includes(username)) return;

  Bots.log({
    type: LogEventType.User,
    description: `${username} has joined the chat.`,
  });
};
