import { BotsProps, ObjectProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onResub = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _streakMonths: number,
  message: string,
  _userstate: ObjectProps,
  _methods: ObjectProps
) => {
  // TODO: Add logic for variations of resub event
  logEvent(
    Bots.discord,
    'alert',
    `${username} has resubbed to the channel!\n\nMessage: ${message}`
  );
};
