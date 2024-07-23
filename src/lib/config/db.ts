import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const mongodbURL = process.env.MONGODB_URL;
  const databaseName = process.env.STAGING
    ? process.env.MONGODB_DB_TEST
    : process.env.MONGODB_DB;

  if (!mongodbURL || !databaseName) {
    console.error('Error connecting to MongoDB: Missing environment variables');
    process.exit(1);
  }

  const dbURL = `${mongodbURL}/${databaseName}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(dbURL);
    console.log('* Database connection successful *');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
