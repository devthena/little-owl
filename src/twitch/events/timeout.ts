import { BotsProps, ObjectProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onTimeout = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  reason: string,
  duration: number,
  _userstate: ObjectProps
) => {
  logEvent(
    Bots.discord,
    'timeout',
    `${username} has been timed out for ${duration}s.\n\nReason: ${reason}`
  );
};
