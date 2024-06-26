import { BotsProps, ObjectProps } from 'src/types';
import { LogEventType } from '../../enums';

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
