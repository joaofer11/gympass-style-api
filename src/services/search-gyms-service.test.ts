import { it, expect, describe, beforeEach } from 'vitest';

import { SearchGymsService } from './search-gyms-service';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository';

describe('Register User Service', () => {
  let gymRepository: InMemoryGymRepository;
  let sut: SearchGymsService;

  beforeEach(() => {
    gymRepository = new InMemoryGymRepository();
    sut = new SearchGymsService({ gymRepository });
  });

  it('should be able to search for gyms', async () => {
    for (let i = 1; i <= 12; i++) {
      gymRepository.create({
        name: i % 2 === 0 ? 'John Doe Gym' : 'Jane Doe Gym',
        description: '',
        phone: '',
        latitude: -5.1602129,
        longitude: -37.3430225,
      });
    }

    const { gyms } = await sut.execute({ query: { name: 'John Doe Gym' } });

    expect(gyms).toHaveLength(6);
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'John Doe Gym' }),
      expect.objectContaining({ name: 'John Doe Gym' }),
      expect.objectContaining({ name: 'John Doe Gym' }),
      expect.objectContaining({ name: 'John Doe Gym' }),
      expect.objectContaining({ name: 'John Doe Gym' }),
      expect.objectContaining({ name: 'John Doe Gym' }),
    ]);
  });

  it('should be able to fetch zero gyms if query does not match', async () => {
    for (let i = 1; i <= 12; i++) {
      gymRepository.create({
        name: i % 2 === 0 ? 'John Doe Gym' : 'Jane Doe Gym',
        description: 'some text here...',
        phone: '',
        latitude: -5.1602129,
        longitude: -37.3430225,
      });
    }

    const { gyms } = await sut.execute({
      query: { name: 'John Doe Gym', description: 'NON_EXISTING_DESCRIPTION' },
    });

    expect(gyms).toHaveLength(0);
  });

  it('should be able to search for paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      gymRepository.create({
        name: `John Doe Gym 0${i}`,
        description: 'some text here...',
        phone: '',
        latitude: -5.1602129,
        longitude: -37.3430225,
      });
    }

    const { gyms } = await sut.execute({
      query: { name: 'John Doe Gym' },
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'John Doe Gym 021' }),
      expect.objectContaining({ name: 'John Doe Gym 022' }),
    ]);
  });
});
