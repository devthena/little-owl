import { BotsProps, ObjectProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onSubGift = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _streakMonths: number,
  recipient: string,
  _methods: ObjectProps,
  _userstate: ObjectProps
) => {
  // TODO: Add logic for variations of subgift events
  logEvent(
    Bots.discord,
    'alert',
    `${username} gifted a subscription to ${recipient}!`
  );
};
