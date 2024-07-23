export const getENV = () => {
  const ADMIN_SERVER_ID = process.env.ADMIN_SERVER_ID;

  const MONGODB_ACTS = process.env.MONGODB_ACTS;
  const MONGODB_STATS = process.env.MONGODB_STATS;
  const MONGODB_USERS = process.env.MONGODB_USERS;

  const SERVER_ID = process.env.SERVER_ID;

  if (
    !ADMIN_SERVER_ID ||
    !MONGODB_ACTS ||
    !MONGODB_STATS ||
    !MONGODB_USERS ||
    !SERVER_ID
  ) {
    throw new Error('Missing necessary environment variables');
  }

  return {
    ADMIN_SERVER_ID,
    MONGODB_ACTS,
    MONGODB_STATS,
    MONGODB_USERS,
    SERVER_ID,
  };
};
