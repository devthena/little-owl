import { LogEventType } from '@/enums';
import { BotsProps, ObjectProps } from '@/types';

export const onSubscription = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _methods: ObjectProps,
  message: string,
  _userstate: ObjectProps
) => {
  Bots.log({
    type: LogEventType.Alert,
    description: `${username} has subscribed to the channel!\n\nMessage: ${message}`,
  });
};
