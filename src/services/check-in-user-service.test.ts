import { it, expect, describe, beforeEach, vi, afterEach } from 'vitest';

import { CheckInUserService } from './check-in-user-service';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { ReachedMaxCheckInPerDay } from './errors/max-check-in-per-day-reached-error';
import { ReachedMaxDistanceFromUserToGym } from './errors/reached-max-distance-from-user-to-gym';

describe('Get User Profile Service', () => {
  let userRepository: InMemoryUserRepository;
  let checkInRepository: InMemoryCheckInRepository;
  let gymRepository: InMemoryGymRepository;
  let sut: CheckInUserService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    checkInRepository = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymRepository();

    gymRepository.create({
      id: 'gym-01',
      name: 'John Doe Gym',
      phone: '',
      description: '',
      latitude: -6.2640892,
      longitude: -38.3113134,
    });

    sut = new CheckInUserService(
      userRepository,
      checkInRepository,
      gymRepository
    );

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not be able to check in user with non-existing user id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'NON_EXISTING',
        gymId: 'NON_EXISTING',
        userLatitude: -6.2640892,
        userLongitude: -38.3113134,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to check in user with non-existing gym id', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      passwordHash: '123456',
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        gymId: 'NON_EXISTING',
        userLatitude: -6.2640892,
        userLongitude: -38.3113134,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be able to check in user', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      passwordHash: '123456',
    });

    const { checkIn } = await sut.execute({
      userId: user.id,
      gymId: 'gym-01',
      userLatitude: -6.2640892,
      userLongitude: -38.3113134,
    });

    expect(checkIn).toEqual(
      expect.objectContaining({
        userId: user.id,
        gymId: 'gym-01',
      })
    );
  });

  it('should not be able to check in user twice on the same day', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      passwordHash: '123456',
    });

    vi.setSystemTime(new Date(2023, 0, 10, 8, 0, 0));

    await sut.execute({
      userId: user.id,
      gymId: 'gym-01',
      userLatitude: -6.2640892,
      userLongitude: -38.3113134,
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        gymId: 'gym-01',
        userLatitude: -6.2640892,
        userLongitude: -38.3113134,
      })
    ).rejects.toBeInstanceOf(ReachedMaxCheckInPerDay);
  });

  it('should be able to check in user twice but in different days', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      passwordHash: '123456',
    });

    vi.setSystemTime(new Date(2023, 0, 10, 8, 0, 0));

    await sut.execute({
      userId: user.id,
      gymId: 'gym-01',
      userLatitude: -6.2640892,
      userLongitude: -38.3113134,
    });

    vi.setSystemTime(new Date(2023, 0, 11, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: user.id,
      gymId: 'gym-01',
      userLatitude: -6.2640892,
      userLongitude: -38.3113134,
    });

    expect(checkIn).toEqual(
      expect.objectContaining({
        userId: user.id,
        gymId: 'gym-01',
      })
    );
  });

  it('should not be able to check in user on a distant gym', async () => {
    const gym = await gymRepository.create({
      id: 'gym-02',
      name: 'John Doe Gym',
      description: '',
      phone: '',
      latitude: -5.1602129,
      longitude: -37.3430225,
    });

    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      passwordHash: '123456',
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        gymId: gym.id,
        userLatitude: -6.2640892,
        userLongitude: -38.3113134,
      })
    ).rejects.toBeInstanceOf(ReachedMaxDistanceFromUserToGym);
  });
});
