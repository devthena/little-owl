import { BotsProps, ObjectProps } from 'src/interfaces';
import { LogEventType, logEvent } from '../../utils';

export const onTimeout = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  reason: string,
  duration: number,
  _userstate: ObjectProps
) => {
  logEvent({
    Bots,
    type: LogEventType.Leave,
    description: `${username} has been timed out for ${duration}s.\n\nReason: ${reason}`,
  });
};
