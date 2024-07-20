import { LogCode } from '@/enums/logs';
import { BotsProps, ObjectProps } from '@/interfaces/bot';

export const onSubGift = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  _streakMonths: number,
  recipient: string,
  _methods: ObjectProps,
  _userstate: ObjectProps
) => {
  Bots.log({
    type: LogCode.Alert,
    description: `${username} gifted a subscription to ${recipient}!`,
  });
};
