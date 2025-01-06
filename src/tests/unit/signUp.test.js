import request from 'supertest';

import app from '../../app.js';
import {
  connectDB,
  disconnectDB,
  dropDB,
  validUserInput,
} from '../setup/db.js';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await dropDB();
});

const baseUrl = '/api/auth/sign-up';
describe(`POST ${baseUrl}`, () => {
  it('Should validate if input is valid', async () => {
    const res = await request(app).post(baseUrl).send({
      email: '',
      password: '',
      name: '',
      lastName: '',
    });

    expect(res.statusCode).toBe(400);

    const errorMessages = [
      'Name is required',
      'Last name is required',
      'Password is required',
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'Email is required',
      'Invalid email',
    ];

    expect(res.body).toHaveProperty('errors');

    const inputIsInvalid = res.body.errors.every((item) =>
      errorMessages.includes(item.msg),
    );

    expect(inputIsInvalid).toBe(true);
  });

  it('Should sign up successfully with correct input', async () => {
    const res = await request(app).post(baseUrl).send(validUserInput);

    expect(res.statusCode).toBe(201);

    const { user } = res.body.data;

    expect(user).toMatchObject({
      name: validUserInput.name,
      lastName: validUserInput.lastName,
    });

    const createdAt = new Date(user.createdAt);
    expect(createdAt).toBeInstanceOf(Date);

    const birthdate = new Date(user.birthdate);
    expect(birthdate).toBeInstanceOf(Date);
    expect(new Date(validUserInput.birthdate)).toEqual(birthdate);
  });
});
