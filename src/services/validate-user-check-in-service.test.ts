import { it, vi, expect, describe, beforeEach, afterEach } from 'vitest';

import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ValidateUserCheckInService } from './validate-user-check-in-service';
import { TooLateCheckInValidationError } from './errors/too-late-check-in-validation-error';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';

describe('Validate User Check-in Service', () => {
  let checkInRepository: InMemoryCheckInRepository;
  let sut: ValidateUserCheckInService;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new ValidateUserCheckInService({ checkInRepository });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it('it should not be able to validate user check-in upon 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 10, 8, 0, 0));

    const createdCheckIn = await checkInRepository.create({
      userId: 'user-01',
      gymId: 'gym-01',
    });

    const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21;

    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS);

    await expect(() =>
      sut.execute({ checkInId: createdCheckIn.id })
    ).rejects.toBeInstanceOf(TooLateCheckInValidationError);
  });
});
