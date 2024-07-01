import { BotsProps, ObjectProps } from 'src/types';
import { LogEventType } from '../../enums';

export const onSubMysteryGift = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  numOfSubs: number,
  _methods: ObjectProps,
  _userstate: ObjectProps
) => {
  // @todo: Update description with more information
  Bots.log({
    type: LogEventType.Alert,
    description: `${username} is gifting ${numOfSubs} subscription${
      numOfSubs > 1 ? 's' : ''
    } in the channel!`,
  });
};
