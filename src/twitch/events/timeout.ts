import { LogEventType } from '@/enums';
import { BotsProps, ObjectProps } from '@/types';

export const onTimeout = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  reason: string,
  duration: number,
  _userstate: ObjectProps
) => {
  Bots.log({
    type: LogEventType.Leave,
    description: `${username} has been timed out for ${duration}s.\n\nReason: ${reason}`,
  });
};
