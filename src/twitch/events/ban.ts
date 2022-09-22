import { BotsProps } from 'src/constants';
import { logEvent } from '../../utils';

export const onBan = (
  Bots: BotsProps,
  channel: string,
  username: string,
  _reason: string
) => {
  // TODO: Remove user information from the database
  logEvent(
    Bots.discord,
    'timeout',
    `${username} has been banned from ${channel}!`
  );
};
