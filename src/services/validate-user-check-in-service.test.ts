import { it, expect, describe, beforeEach } from 'vitest';

import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ValidateUserCheckInService } from './validate-user-check-in-service';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';

describe('Get User Profile Service', () => {
  let checkInRepository: InMemoryCheckInRepository;
  let sut: ValidateUserCheckInService;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new ValidateUserCheckInService({ checkInRepository });
  });

  it('should be able to validate user check-in', async () => {
    const createdCheckIn = await checkInRepository.create({
      userId: 'user-01',
      gymId: 'gym-01',
    });

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id });

    expect(checkIn.updatedAt).toEqual(expect.any(Date));
    expect(checkInRepository.items[0].updatedAt).toEqual(expect.any(Date));
  });

  it('should not be able to validate a non-existent user check-in', async () => {
    await expect(() =>
      sut.execute({ checkInId: 'NON_EXISTING_ID' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
