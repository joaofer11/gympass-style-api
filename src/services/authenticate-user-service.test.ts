import { it, expect, describe } from 'vitest';

import { AuthenticateUserService } from './authenticate-user-service';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
import { hash } from 'bcryptjs';

describe('Register User Service', () => {
  it('should not be able to authenticate a user with invalid email', async () => {
    const userRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUserService(userRepository);

    await expect(() =>
      sut.execute({
        email: 'INVALID_EMAIL',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate a user with invalid password', async () => {
    const userRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUserService(userRepository);

    const EMAIL = 'johndoe@mail.com';

    await userRepository.create({
      name: 'John Doe',
      email: EMAIL,
      passwordHash: await hash('123456', 6),
    });

    await expect(() =>
      sut.execute({
        email: EMAIL,
        password: 'INVALID_PASSWORD',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should be able to authenticate a user', async () => {
    const userRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUserService(userRepository);

    await userRepository.create({
      id: '5',
      name: 'John Doe',
      email: 'johndoe@mail.com',
      passwordHash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'johndoe@mail.com',
      password: '123456',
    });

    expect(user).toEqual(
      expect.objectContaining({
        id: '5',
      })
    );
  });
});
