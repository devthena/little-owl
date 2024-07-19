import { LogEventType } from '@/enums';
import { BotsProps, ObjectProps } from '@/types';

export const onCheer = (
  Bots: BotsProps,
  _channel: string,
  userstate: ObjectProps,
  message: string
) => {
  Bots.log({
    type: LogEventType.Alert,
    description: `${userstate.username} cheered ${userstate.bits} in the chat!\n\nMessage: ${message}`,
  });
};
