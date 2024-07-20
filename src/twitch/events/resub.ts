import { LogCode } from '@/enums/logs';
import { BotsProps, ObjectProps } from '@/interfaces/bot';

export const onResub = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  streakMonths: number,
  message: string,
  _userstate: ObjectProps,
  _methods: ObjectProps
) => {
  Bots.log({
    type: LogCode.Alert,
    description: `${username} has resubbed to the channel!\n\nStreak: ${streakMonths}\nMessage: ${message}`,
  });
};
