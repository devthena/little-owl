import { User } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import { InitialUserObject } from '@/constants/states';
import { LogEventType } from '@/enums';
import { UserObject } from '@/interfaces/user';

import {
  addUser,
  addUserCash,
  getUserById,
  getUserByName,
  removeAuthUser,
  removeUser,
  updateUser,
} from '@/models/user';

import { BotsProps, ObjectProps } from '@/types';

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
      type: LogEventType.Error,
      description: JSON.stringify(error),
    });
  }
};

export const deleteUser = async (Bots: BotsProps, id: string) => {
  try {
    await removeUser(Bots, id);
  } catch (error) {
    Bots.log({
      type: LogEventType.Error,
      description: JSON.stringify(error),
    });
  }
};

export const deleteDiscordUser = async (Bots: BotsProps, id: string) => {
  try {
    await removeAuthUser(Bots, id, 'discord');
  } catch (error) {
    Bots.log({
      type: LogEventType.Error,
      description: JSON.stringify(error),
    });
  }
};

export const deleteTwitchUser = async (Bots: BotsProps, id: string) => {
  try {
    await removeAuthUser(Bots, id, 'twitch');
  } catch (error) {
    Bots.log({
      type: LogEventType.Error,
      description: JSON.stringify(error),
    });
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
      type: LogEventType.Error,
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
      type: LogEventType.Error,
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
      type: LogEventType.Error,
      description: JSON.stringify(error),
    });
    return;
  }
};

export const incDiscordUserCash = async (
  Bots: BotsProps,
  id: string,
  value: number
) => {
  try {
    await addUserCash(Bots, id, 'discord', value);
  } catch (error) {
    Bots.log({
      type: LogEventType.Error,
      description: JSON.stringify(error),
    });
  }
};

export const incTwitchUserCash = async (
  Bots: BotsProps,
  id: string,
  value: number
) => {
  try {
    await addUserCash(Bots, id, 'twitch', value);
  } catch (error) {
    Bots.log({
      type: LogEventType.Error,
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
      type: LogEventType.Error,
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
      type: LogEventType.Error,
      description: JSON.stringify(error),
    });
  }
};
