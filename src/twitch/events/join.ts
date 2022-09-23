import { BotsProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onJoin = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  self: boolean
) => {
  if (self) return console.log('* littleowlbot is online *');
  logEvent(Bots.discord, 'user', `${username} has joined the chat.`);
};
