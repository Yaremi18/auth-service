import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, clientOptions);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('Error connecteing to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
