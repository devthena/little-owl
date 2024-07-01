import { BotsProps, ObjectProps } from 'src/types';
import { LogEventType } from '../../enums';

export const onSubGift = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _streakMonths: number,
  recipient: string,
  _methods: ObjectProps,
  _userstate: ObjectProps
) => {
  // @todo: Add logic for variations of subgift events
  Bots.log({
    type: LogEventType.Alert,
    description: `${username} gifted a subscription to ${recipient}!`,
  });
};
