import { BotsProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onJoin = async (
  Bots: BotsProps,
  _channel: string,
  username: string,
  self: boolean
) => {
  if (self) return console.log('* Twitch LittleOwl is online *');
  logEvent(Bots, 'user', `${username} has joined the chat.`);
};
