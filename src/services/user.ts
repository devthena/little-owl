import { User } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import { LogCode } from '@/enums/logs';
import { ObjectProps } from '@/interfaces/bot';
import { UserDocument, UserIncrementFields } from '@/interfaces/user';
import { UserModel } from '@/models/user';

export const createUser = async (
  log: Function,
  payload: Partial<UserDocument>
): Promise<UserDocument | undefined> => {
  try {
    const user = new UserModel(payload);
    return user.save();
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return;
  }
};

export const deleteUser = async (
  log: Function,
  id: string
): Promise<UserDocument | null> => {
  try {
    const deleted = await UserModel.findOneAndDelete({ user_id: id });
    return deleted;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return null;
  }
};

export const deleteUserByDiscordId = async (
  log: Function,
  id: string
): Promise<UserDocument | null> => {
  try {
    const deleted = await UserModel.findOneAndDelete({ discord_id: id });
    return deleted;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return null;
  }
};

export const deleteUserByTwitchUsername = async (
  log: Function,
  username: string
): Promise<UserDocument | null> => {
  try {
    const deleted = await UserModel.findOneAndDelete({
      twitch_username: username,
    });
    return deleted;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return null;
  }
};

export const findOrCreateDiscordUser = async (
  log: Function,
  discordUser: User
): Promise<UserDocument | undefined> => {
  try {
    let user = await UserModel.findOne({ discord_id: discordUser.id }).exec();

    if (!user) {
      user = new UserModel({
        user_id: uuidv4(),
        discord_id: discordUser.id,
        discord_username: discordUser.username,
        discord_name: discordUser.displayName,
      });

      await user.save();
    }

    return user;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return;
  }
};

export const findOrCreateTwitchUser = async (
  log: Function,
  userstate: ObjectProps
): Promise<UserDocument | undefined> => {
  try {
    let user = await UserModel.findOne({
      twitch_id: userstate['user-id'],
    }).exec();

    if (!user) {
      user = new UserModel({
        user_id: uuidv4(),
        twitch_id: userstate['user-id'],
        twitch_username: userstate.username,
      });

      await user.save();
    }

    return user;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return;
  }
};

export const getTwitchUserByName = async (
  log: Function,
  username: string
): Promise<UserDocument | null> => {
  try {
    const user = await UserModel.findOne({
      twitch_username: username,
    }).exec();
    return user;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return null;
  }
};

export const getUserById = async (
  log: Function,
  id: string
): Promise<UserDocument | null> => {
  try {
    const user = await UserModel.findOne({
      user_id: id,
    }).exec();
    return user;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return null;
  }
};

export const getUsersByCategory = async (
  log: Function,
  category: string,
  max: number
): Promise<UserDocument[]> => {
  try {
    const users = await UserModel.find({
      discord_id: { $exists: true, $ne: null },
      [category]: { $gt: 0 },
    })
      .sort({ [category]: -1 })
      .limit(max)
      .exec();

    return users;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return [];
  }
};

export const getUserRank = async (
  log: Function,
  value: number
): Promise<number | null> => {
  try {
    const rank = await UserModel.countDocuments({
      discord_id: { $exists: true, $ne: null },
      cash: { $gt: value },
    });
    return rank + 1;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return null;
  }
};

export const incDiscordUser = async (
  log: Function,
  id: string,
  values: UserIncrementFields
) => {
  if (Object.keys(values).length === 0) {
    throw new Error('No fields specified for increment.');
  }

  try {
    const result = await UserModel.updateOne(
      { discord_id: id },
      { $inc: values }
    );

    if (result.modifiedCount === 0) {
      log({
        type: LogCode.Error,
        description: `Increment Discord User: No user found with Discord ID: ${id}`,
      });
    }
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const incTwitchUser = async (
  log: Function,
  id: string,
  values: UserIncrementFields
) => {
  if (Object.keys(values).length === 0) {
    throw new Error('No fields specified for increment.');
  }

  try {
    const result = await UserModel.updateOne(
      { twitch_id: id },
      { $inc: values }
    );

    if (result.modifiedCount === 0) {
      log({
        type: LogCode.Error,
        description: `Increment Discord User: No user found with Discord ID: ${id}`,
      });
    }
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
  }
};

export const setDiscordUser = async (
  log: Function,
  id: string,
  payload: Partial<UserDocument>
): Promise<UserDocument | null> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { discord_id: id },
      { $set: { ...payload } }
    );
    return user;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return null;
  }
};

export const setTwitchUser = async (
  log: Function,
  id: string,
  payload: Partial<UserDocument>
): Promise<UserDocument | null> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { twitch_id: id },
      { $set: { ...payload } }
    );
    return user;
  } catch (error) {
    log({
      type: LogCode.Error,
      description: JSON.stringify(error),
    });
    return null;
  }
};
