import { BotsProps, ObjectProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onSubscription = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _methods: ObjectProps,
  message: string,
  _userstate: ObjectProps
) => {
  logEvent(
    Bots,
    'alert',
    `${username} has subscribed to the channel!\n\nMessage: ${message}`
  );
};
