import { BotsProps } from 'src/constants';
import { logEvent } from '../../utils';

export const onPart = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _self: boolean
) => {
  logEvent(Bots.discord, 'user', `${username} has left the chat.`);
};
