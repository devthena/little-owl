import { LogCode } from '@/enums/logs';
import { BotsProps, ObjectProps } from '@/interfaces/bot';

export const onTimeout = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  reason: string,
  duration: number,
  _userstate: ObjectProps
) => {
  Bots.log({
    type: LogCode.Leave,
    description: `${username} has been timed out for ${duration}s.\n\nReason: ${reason}`,
  });
};
