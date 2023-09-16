import { it, expect, describe, beforeEach } from 'vitest';

import { FetchUserCheckInsHistoryService } from './fetch-user-check-ins-history-service';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';

describe('Get User Profile Service', () => {
  let checkInRepository: InMemoryCheckInRepository;
  let sut: FetchUserCheckInsHistoryService;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new FetchUserCheckInsHistoryService(checkInRepository);
  });

  it('should be able to fetch user check-ins history', async () => {
    for (let i = 1; i <= 4; i++) {
      checkInRepository.create({
        userId: 'user-01',
        gymId: `gym-0${i}`,
      });
    }

    const { checkIns } = await sut.execute({ userId: 'user-01' });

    expect(checkIns).toHaveLength(4);
    expect(checkIns).toEqual([
      expect.objectContaining({ userId: 'user-01', gymId: 'gym-01' }),
      expect.objectContaining({ userId: 'user-01', gymId: 'gym-02' }),
      expect.objectContaining({ userId: 'user-01', gymId: 'gym-03' }),
      expect.objectContaining({ userId: 'user-01', gymId: 'gym-04' }),
    ]);
  });

  it('should be able to fetch paginated user check-ins history', async () => {
    for (let i = 1; i <= 24; i++) {
      checkInRepository.create({
        userId: 'user-01',
        gymId: `gym-0${i}`,
      });
    }

    const { checkIns } = await sut.execute({ userId: 'user-01', page: 2 });

    expect(checkIns).toHaveLength(4);
    expect(checkIns).toEqual([
      expect.objectContaining({ userId: 'user-01', gymId: 'gym-021' }),
      expect.objectContaining({ userId: 'user-01', gymId: 'gym-022' }),
      expect.objectContaining({ userId: 'user-01', gymId: 'gym-023' }),
      expect.objectContaining({ userId: 'user-01', gymId: 'gym-024' }),
    ]);
  });
});
