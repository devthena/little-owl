import { UserAuthMethod, UserDocument, UserObject } from '@/interfaces/user';
import { BotsProps } from '@/types';

export const addUser = async (Bots: BotsProps, data: UserObject) => {
  await Bots.db?.collection(Bots.env.MONGODB_USERS).insertOne(data);
};

export const addUserCash = async (
  Bots: BotsProps,
  id: string,
  method: UserAuthMethod,
  value: number
) => {
  await Bots.db
    ?.collection(Bots.env.MONGODB_USERS)
    .updateOne({ [`${method}_id`]: id }, { $inc: { cash: value } });
};

export const removeUser = async (Bots: BotsProps, id: string) => {
  await Bots.db?.collection(Bots.env.MONGODB_USERS).deleteOne({
    user_id: id,
  });
};

export const removeAuthUser = async (
  Bots: BotsProps,
  id: string,
  method: UserAuthMethod
) => {
  switch (method) {
    case 'discord':
      await Bots.db?.collection(Bots.env.MONGODB_USERS).deleteOne({
        discord_id: id,
      });
      break;
    case 'twitch':
      await Bots.db?.collection(Bots.env.MONGODB_USERS).deleteOne({
        twitch_username: id,
      });
  }
};

export const getUserById = async (
  Bots: BotsProps,
  id: string,
  method: UserAuthMethod
): Promise<UserDocument | null | undefined> => {
  return await Bots.db
    ?.collection<UserDocument>(Bots.env.MONGODB_USERS)
    .findOne({ [`${method}_id`]: id });
};

export const getUserByName = async (
  Bots: BotsProps,
  username: string,
  method: UserAuthMethod
): Promise<UserDocument | null | undefined> => {
  return await Bots.db
    ?.collection<UserDocument>(Bots.env.MONGODB_USERS)
    .findOne({ [`${method}_username`]: username.toLowerCase() });
};

export const updateUser = async (
  Bots: BotsProps,
  id: string,
  method: UserAuthMethod,
  payload: Partial<UserObject>
) => {
  await Bots.db
    ?.collection(Bots.env.MONGODB_USERS)
    .updateOne({ [`${method}_id`]: id }, { $set: { ...payload } });
};
