import { User } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import { InitialUserObject } from '@/constants/states';
import { LogCode } from '@/enums/logs';
import { BotsProps, ObjectProps } from '@/interfaces/bot';
import { UserNumberObject, UserObject } from '@/interfaces/user';

import {
  addUser,
  getRank,
  getTopUsers,
  getUser,
  getUserById,
  getUserByName,
  incrementUser,
  removeAuthUser,
  removeUser,
  updateUser,
} from '@/models/user';

export const createUser = async (
  Bots: BotsProps,
  payload: Partial<UserObject>
) => {
  try {
    const data: UserObject = {
      ...InitialUserObject,
      ...payload,
    };

    await addUser(Bots, data);
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const deleteUser = async (Bots: BotsProps, id: string) => {
  try {
    await removeUser(Bots, id);
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const deleteDiscordUser = async (Bots: BotsProps, id: string) => {
  try {
    await removeAuthUser(Bots, id, 'discord');
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const deleteTwitchUser = async (Bots: BotsProps, id: string) => {
  try {
    await removeAuthUser(Bots, id, 'twitch');
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const getLeaderboardUsers = async (
  Bots: BotsProps,
  category: string,
  max: number
) => {
  let data: UserObject[] = [];
  try {
    data = (await getTopUsers(Bots, category, max)) ?? [];
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  } finally {
    return data;
  }
};

export const getDiscordUser = async (
  Bots: BotsProps,
  discordUser: User
): Promise<UserObject> => {
  let data: UserObject = {
    ...InitialUserObject,
    user_id: uuidv4(),
    discord_id: discordUser.id,
    discord_username: discordUser.username,
    discord_name: discordUser.globalName,
  };

  try {
    const document = await getUserById(Bots, discordUser.id, 'discord');

    if (!document) await addUser(Bots, data);
    else {
      const { _id, ...rest } = document;
      data = { ...rest };
    }
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  } finally {
    return data;
  }
};

export const getTwitchUserById = async (
  Bots: BotsProps,
  userstate: ObjectProps
): Promise<UserObject> => {
  let data: UserObject = {
    ...InitialUserObject,
    user_id: uuidv4(),
    twitch_id: userstate['user-id'],
    twitch_username: userstate.username,
  };

  try {
    const document = await getUserById(Bots, userstate['user-id'], 'twitch');

    if (!document) await addUser(Bots, data);
    else {
      const { _id, ...rest } = document;
      data = { ...rest };
    }
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  } finally {
    return data;
  }
};

export const getTwitchUserByName = async (
  Bots: BotsProps,
  username: string
): Promise<UserObject | null | undefined> => {
  try {
    return await getUserByName(Bots, username, 'twitch');
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return;
  }
};

export const getUserObject = async (
  Bots: BotsProps,
  id: string
): Promise<UserObject | null | undefined> => {
  try {
    return await getUser(Bots, id);
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return;
  }
};

export const getUserRank = async (
  Bots: BotsProps,
  value: number
): Promise<number | null | undefined> => {
  try {
    return await getRank(Bots, value);
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return;
  }
};

export const incDiscordUser = async (
  Bots: BotsProps,
  id: string,
  values: UserNumberObject
) => {
  try {
    await incrementUser(Bots, id, 'discord', values);
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const incTwitchUser = async (
  Bots: BotsProps,
  id: string,
  values: UserNumberObject
) => {
  try {
    await incrementUser(Bots, id, 'twitch', values);
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const setDiscordUser = async (
  Bots: BotsProps,
  id: string,
  payload: Partial<UserObject>
) => {
  try {
    await updateUser(Bots, id, 'discord', payload);
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const setTwitchUser = async (
  Bots: BotsProps,
  id: string,
  payload: Partial<UserObject>
) => {
  try {
    await updateUser(Bots, id, 'twitch', payload);
  } catch (error) {
    Bots.log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};
