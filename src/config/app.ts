require('dotenv').config();

export const appConfig = {
  env: {
    ADMIN_SERVER_ID: process.env.ADMIN_SERVER_ID || '',
    MONGODB_USERS:
      (process.env.STAGING
        ? process.env.MONGODB_USERS_STAGE
        : process.env.MONGODB_USERS_PROD) || '',
    MONGODB_USER_ACTIVITIES:
      (process.env.STAGING
        ? process.env.MONGODB_ACTIVITES_USER_STAGE
        : process.env.MONGODB_ACTIVITES_USER_PROD) || '',
    SERVER_ID: process.env.SERVER_ID || '',
    DISCORD_TOKEN: process.env.DISCORD_TOKEN || '',
  },
  twitch: {
    identity: {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    },
    channels: process.env.CHANNELS?.split(','),
  },
};
