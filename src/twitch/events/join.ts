import { IGNORE_LIST } from 'src/constants';
import { LogEventType } from 'src/enums';
import { BotsProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onJoin = async (
  Bots: BotsProps,
  _channel: string,
  username: string,
  self: boolean
) => {
  if (self) return console.log('* Twitch LittleOwl is online *');
  if (IGNORE_LIST.includes(username)) return;

  logEvent({
    Bots,
    type: LogEventType.User,
    description: `${username} has joined the chat.`,
  });
};
