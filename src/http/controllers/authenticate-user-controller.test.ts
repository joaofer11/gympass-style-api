import { it, expect, describe, beforeAll, afterAll } from 'vitest';

import { app } from '@/app';
import request from 'supertest';

describe('Authenticate User Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not be able to authenticate an invalid user', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
