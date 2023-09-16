import { it, expect, describe, beforeEach } from 'vitest';

import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
import { hash } from 'bcryptjs';
import { GetUserProfileService } from './get-user-profile-service';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

describe('Get User Profile Service', () => {
  let userRepository: InMemoryUserRepository;
  let sut: GetUserProfileService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new GetUserProfileService(userRepository);
  });

  it('should be able to get user profile', async () => {
    const existingUser = await userRepository.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      passwordHash: await hash('123456', 6),
    });

    const { user } = await sut.execute({ userId: existingUser.id });

    expect(user).toEqual(
      expect.objectContaining({
        id: existingUser.id,
        name: existingUser.name,
      })
    );
  });

  it('should not be able to get user profile with wrong id', async () => {
    await userRepository.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      passwordHash: await hash('123456', 6),
    });

    await expect(() =>
      sut.execute({ userId: 'WRONG_ID' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
