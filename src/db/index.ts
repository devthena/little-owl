import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  try {
    const connectionString = `${process.env.MONGODB_URL}/${process.env.MONGODB_DB}`;
    await mongoose.connect(connectionString, {
      retryWrites: true,
      w: 'majority',
    });
  } catch (error) {
    console.error('Database connection error:', error);
  }
};
