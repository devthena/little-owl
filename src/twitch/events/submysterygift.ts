import { BotsProps, ObjectProps } from 'src/constants';
import { logEvent } from '../../utils';

export const onSubMysteryGift = (
  Bots: BotsProps,
  _channel: string,
  username: string,
  numOfSubs: number,
  _methods: ObjectProps,
  _userstate: ObjectProps
) => {
  // TODO: Update description with more information
  logEvent(
    Bots.discord,
    'alert',
    `${username} is gifting ${numOfSubs} subscription${
      numOfSubs > 1 ? 's' : ''
    } in the channel!`
  );
};
