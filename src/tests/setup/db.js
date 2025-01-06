import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import User from '../../models/User.js';

let mongoServer;

export const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const URI = mongoServer.getUri();

  await mongoose.connect(URI);
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

export const dropDB = async () => {
  if (mongoose.connection.db) await mongoose.connection.db.dropDatabase();
};

export const validUserInput = {
  email: 'valid@test.com',
  password: 'testPassword123!',
  name: 'Fake name',
  lastName: 'Fake last name',
  birthdate: '1994-10-18',
};

export const createTestUser = async () => {
  const user = new User(validUserInput);
  await user.save();

  return validUserInput;
};
