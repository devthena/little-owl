import { BotsProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onBan = (
  Bots: BotsProps,
  channel: string,
  username: string,
  _reason: string
) => {
  // TODO: Remove user information from the database
  logEvent(Bots, 'timeout', `${username} has been banned from ${channel}!`);
};
