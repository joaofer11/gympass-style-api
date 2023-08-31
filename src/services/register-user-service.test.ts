import { it, expect, describe } from 'vitest';

import { compare } from 'bcryptjs';
import { RegisterUserService } from './register-user-service';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
import { EmailIsAlreadyInUseError } from './errors/email-is-already-in-use-error';

describe('Register User Service', () => {
  it('should be able to register a user', async () => {
    const userRepostory = new InMemoryUserRepository();
    const sut = new RegisterUserService(userRepostory);

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      })
    );
  });

  it('should not be able to register user with same email twice', async () => {
    const userRepostory = new InMemoryUserRepository();
    const sut = new RegisterUserService(userRepostory);

    const EMAIL = 'johndoe@mail.com';

    await sut.execute({
      name: 'John Doe',
      email: EMAIL,
      password: '123456',
    });

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: EMAIL,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(EmailIsAlreadyInUseError);
  });

  it('should be able to hash user password upon registration', async () => {
    const userRepostory = new InMemoryUserRepository();
    const sut = new RegisterUserService(userRepostory);

    const PASSWORD = '123456';

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: PASSWORD,
    });

    const hasPasswordCorrectlyHashed = await compare(
      PASSWORD,
      user.passwordHash
    );

    expect(hasPasswordCorrectlyHashed).toBe(true);
  });
});
