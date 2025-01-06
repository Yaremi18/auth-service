import request from 'supertest';

import app from '../../app.js';
import {
  connectDB,
  createTestUser,
  disconnectDB,
  dropDB,
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

const baseUrl = '/api/auth/logout';
describe(`POST ${baseUrl}`, () => {
  it('Should clear cookie', async () => {
    await createTestUser();

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'valid@test.com',
      password: 'testPassword123!',
    });

    const cookies = loginRes.headers['set-cookie'];

    expect(cookies).toBeDefined();
    expect(cookies.some((cookie) => cookie.includes('jwt='))).toBe(true);

    const logoutRes = await request(app).post(baseUrl).set('Cookie', cookies);
    const logoutCookies = logoutRes.headers['set-cookie'];

    expect(logoutRes.statusCode).toBe(200);
    expect(logoutRes.body.message).toBe('Logout successful');
    expect(logoutCookies).toBeDefined();
    expect(logoutCookies.some((cookie) => cookie.includes('jwt=;'))).toBe(true);
  });
});
