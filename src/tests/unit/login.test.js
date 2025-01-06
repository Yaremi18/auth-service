import request from 'supertest';

import app from '../../app.js';
import {
  connectDB,
  createTestUser,
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

beforeEach(async () => {
  await createTestUser();
});

afterEach(async () => {
  await dropDB();
});

const baseUrl = '/api/auth/login';

describe(`POST ${baseUrl}`, () => {
  it('should validate email and password are valid and required', async () => {
    const res = await request(app).post(baseUrl).send({
      email: '',
      password: '',
    });

    expect(res.statusCode).toBe(400);

    expect(res.body).toHaveProperty('errors');

    const errorMessages = [
      'Password is required',
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'Email is required',
      'Invalid email',
    ];

    const inputIsInvalid = res.body.errors.every((item) =>
      errorMessages.includes(item.msg),
    );

    expect(inputIsInvalid).toBe(true);
  });

  it('should not login with incorrect credentials', async () => {
    const res = await request(app).post(baseUrl).send({
      email: 'invalid@test.com',
      password: 'testPassword123!',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');

    const tryAgainRes = await request(app).post(baseUrl).send({
      email: validUserInput.email,
      password: 'testPassword123*', // Invalid password for a valid email
    });

    expect(tryAgainRes.statusCode).toBe(401);
    expect(tryAgainRes.body).toHaveProperty(
      'message',
      'Invalid email or password',
    );
  });

  it('should login successfully with correct credentials', async () => {
    const res = await request(app).post(baseUrl).send({
      email: validUserInput.email,
      password: validUserInput.password,
    });

    expect(res.statusCode).toBe(200);

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

    expect(res.headers['set-cookie']).toBeDefined();
  });
});
