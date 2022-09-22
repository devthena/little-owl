import { Client } from 'tmi.js';
import { ObjectProps } from 'src/constants';

export const onSubMysteryGift = (
  _Bot: Client,
  _channel: string,
  username: string,
  numOfSubs: number,
  _methods: ObjectProps,
  _userstate: ObjectProps
) => {
  // TODO: Add logic for variations of subgift events
  // TODO: Log this event on private server
  console.log(
    `${username} is gifting ${numOfSubs} subscription${
      numOfSubs > 1 ? 's' : ''
    } in the channel!`
  );
};
