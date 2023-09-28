import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import request from 'supertest';

describe('Register User Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('it should be able to register a user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(response.statusCode).toEqual(201);
  });
});
