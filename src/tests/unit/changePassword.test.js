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

let cookies;

beforeEach(async () => {
  await createTestUser();

  const loginRes = await request(app).post('/api/auth/login').send({
    email: validUserInput.email,
    password: validUserInput.password,
  });

  cookies = loginRes.headers['set-cookie'];

  expect(cookies).toBeDefined();
  expect(cookies.some((cookie) => cookie.includes('jwt='))).toBe(true);
});

afterEach(async () => {
  await dropDB();
});

const baseUrl = '/api/auth/change-password';
describe(`PUT ${baseUrl}`, () => {
  it('Should validate if current password is correct', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        currentPassword: 'IncorrectPsw12!',
        newPassword: 'NewPassword12!',
      })
      .set('Cookie', cookies);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid current password');
  });

  it('Should validate if new password is the same as the current', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        currentPassword: validUserInput.password,
        newPassword: validUserInput.password,
      })
      .set('Cookie', cookies);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'The new password cannot be the same as the current password',
    );
  });

  it('Should change password successfuly if input is valid', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        currentPassword: validUserInput.password,
        newPassword: 'NewPassword12!',
      })
      .set('Cookie', cookies);

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
  });
});
