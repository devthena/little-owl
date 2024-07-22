import { BotsProps } from '@/interfaces/bot';

import {
  UserAuthMethod,
  UserDocument,
  UserNumberObject,
  UserObject,
} from '@/interfaces/user';

export const addUser = async (Bots: BotsProps, data: UserObject) => {
  await Bots.db?.collection(Bots.env.MONGODB_USERS).insertOne(data);
};

export const getRank = async (
  Bots: BotsProps,
  value: number
): Promise<number | null> => {
  const userCollection = await Bots.db?.collection<UserDocument>(
    Bots.env.MONGODB_USERS
  );

  if (userCollection) {
    const rank = await userCollection.countDocuments({
      discord_id: { $exists: true, $ne: null },
      cash: { $gt: value },
    });
    return rank + 1;
  }

  return null;
};

export const getTopUsers = async (
  Bots: BotsProps,
  category: string,
  max: number
): Promise<UserDocument[] | undefined> => {
  return await Bots.db
    ?.collection<UserDocument>(Bots.env.MONGODB_USERS)
    .find({ discord_id: { $exists: true, $ne: null }, [category]: { $gt: 0 } })
    .sort({ [category]: -1 })
    .limit(max)
    .toArray();
};

export const getUser = async (
  Bots: BotsProps,
  id: string
): Promise<UserDocument | null | undefined> => {
  return await Bots.db
    ?.collection<UserDocument>(Bots.env.MONGODB_USERS)
    .findOne({ user_id: id });
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

export const incrementUser = async (
  Bots: BotsProps,
  id: string,
  method: UserAuthMethod,
  payload: UserNumberObject
) => {
  await Bots.db
    ?.collection(Bots.env.MONGODB_USERS)
    .updateOne({ [`${method}_id`]: id }, { $inc: { ...payload } });
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
