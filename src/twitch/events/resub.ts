import { LogEventType } from '@/enums';
import { BotsProps, ObjectProps } from '@/types';

export const onResub = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _streakMonths: number,
  message: string,
  _userstate: ObjectProps,
  _methods: ObjectProps
) => {
  // @todo: Add logic for variations of resub event
  Bots.log({
    type: LogEventType.Alert,
    description: `${username} has resubbed to the channel!\n\nMessage: ${message}`,
  });
};
