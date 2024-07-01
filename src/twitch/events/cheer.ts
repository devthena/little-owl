import { BotsProps, ObjectProps } from 'src/types';
import { LogEventType } from '../../enums';

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
