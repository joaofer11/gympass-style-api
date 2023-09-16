import { it, expect, describe, beforeEach } from 'vitest';

import { GetUserMetricsService } from './get-user-metrics-service';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';

describe('Get User Profile Service', () => {
  let checkInRepository: InMemoryCheckInRepository;
  let sut: GetUserMetricsService;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new GetUserMetricsService(checkInRepository);
  });

  it('should be able to get user check-ins count from metrics', async () => {
    for (let i = 1; i <= 10; i++) {
      checkInRepository.create({
        userId: 'user-01',
        gymId: `gym-0${i}`,
      });
    }

    const { count } = await sut.execute({ userId: 'user-01' });

    expect(count).toEqual(10);
  });
});
