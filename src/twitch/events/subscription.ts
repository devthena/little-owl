import { LogCode } from '@/enums/logs';
import { BotsProps, ObjectProps } from '@/interfaces/bot';

export const onSubscription = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _methods: ObjectProps,
  message: string,
  _userstate: ObjectProps
) => {
  Bots.log({
    type: LogCode.Alert,
    description: `${username} has subscribed to the channel!\n\nMessage: ${message}`,
  });
};
