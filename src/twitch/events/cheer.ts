import { BotsProps, ObjectProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onCheer = (
  Bots: BotsProps,
  _channel: string,
  userstate: ObjectProps,
  message: string
) => {
  logEvent({
    Bots,
    type: 'alert',
    description: `${userstate.username} cheered ${userstate.bits} in the chat!\n\nMessage: ${message}`,
  });
};
