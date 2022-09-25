import { BotsProps } from 'src/interfaces';
import { logEvent } from '../../utils';

export const onJoin = async (
  Bots: BotsProps,
  _channel: string,
  username: string,
  self: boolean
) => {
  if (self) return console.log('* littleowlbot is online *');

  logEvent(Bots.discord, 'user', `${username} has joined the chat.`);

  if (process.env.MONGODB_VIEW) {
    await Bots.db?.collection(process.env.MONGODB_VIEW).updateOne(
      { username: username },
      {
        $set: {
          last_visit: new Date().toString(),
        },
      },
      { upsert: true }
    );
  }
};
