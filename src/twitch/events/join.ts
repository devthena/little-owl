import { BotsProps } from 'src/interfaces';
import { IGNORE_LIST } from '../../constants';
import { logEvent } from '../../utils';

export const onJoin = async (
  Bots: BotsProps,
  _channel: string,
  username: string,
  self: boolean
) => {
  if (self) return console.log('* Twitch LittleOwl is online *');
  else if (IGNORE_LIST.includes(username)) return;

  logEvent({
    Bots,
    type: 'user',
    description: `${username} has joined the chat.`,
  });
};
