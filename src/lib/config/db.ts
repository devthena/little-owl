import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const mongodbURL = process.env.MONGODB_URL;
  const databaseName = process.env.STAGING
    ? process.env.MONGODB_DB_TEST
    : process.env.MONGODB_DB;

  if (!mongodbURL || !databaseName) {
    console.error('🦉 Error: MongoDB Missing Environment Variables');
    process.exit(1);
  }

  const dbURL = `${mongodbURL}/${databaseName}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(dbURL);
    console.log('🦉 Database Connection: Success');
  } catch (error) {
    console.error('🦉 Error: ' + error);
    process.exit(1);
  }
};
