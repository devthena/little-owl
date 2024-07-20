import { IGNORE_LIST } from '@/constants';
import { LogCode } from '@/enums/logs';
import { BotsProps } from '@/interfaces/bot';

export const onJoin = async (
  Bots: BotsProps,
  _channel: string,
  username: string,
  self: boolean
) => {
  if (self) return console.log('* Twitch LittleOwl is online *');
  if (IGNORE_LIST.includes(username)) return;

  Bots.log({
    type: LogCode.User,
    description: `${username} has joined the chat.`,
  });
};
