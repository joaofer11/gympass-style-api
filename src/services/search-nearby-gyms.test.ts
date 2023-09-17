import { it, expect, describe, beforeEach } from 'vitest';

import { SearchNearbyGyms } from './search-nearby-gyms';
import { Decimal } from '@prisma/client/runtime/library';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository';

describe('Register User Service', () => {
  let gymRepository: InMemoryGymRepository;
  let sut: SearchNearbyGyms;

  beforeEach(() => {
    gymRepository = new InMemoryGymRepository();
    sut = new SearchNearbyGyms({ gymRepository });
  });

  it('should be able to search for nearby gyms', async () => {
    for (let i = 1; i <= 12; i++) {
      gymRepository.create({
        name: i % 2 === 0 ? 'Near Gym' : 'Far Gym',
        description: '',
        phone: '',
        latitude: i % 2 === 0 ? -5.1602129 : -7.230234,
        longitude: i % 2 === 0 ? -37.3430225 : -38.0178174,
      });
    }

    const { gyms } = await sut.execute({
      userLatitude: -5.1602129,
      userLongitude: -37.3430225,
    });

    expect(gyms).toHaveLength(6);
    expect(gyms).toEqual([
      expect.objectContaining({
        name: 'Near Gym',
        latitude: new Decimal(-5.1602129),
        longitude: new Decimal(-37.3430225),
      }),
      expect.objectContaining({
        name: 'Near Gym',
        latitude: new Decimal(-5.1602129),
        longitude: new Decimal(-37.3430225),
      }),
      expect.objectContaining({
        name: 'Near Gym',
        latitude: new Decimal(-5.1602129),
        longitude: new Decimal(-37.3430225),
      }),
      expect.objectContaining({
        name: 'Near Gym',
        latitude: new Decimal(-5.1602129),
        longitude: new Decimal(-37.3430225),
      }),
      expect.objectContaining({
        name: 'Near Gym',
        latitude: new Decimal(-5.1602129),
        longitude: new Decimal(-37.3430225),
      }),
      expect.objectContaining({
        name: 'Near Gym',
        latitude: new Decimal(-5.1602129),
        longitude: new Decimal(-37.3430225),
      }),
    ]);
  });

  it('should be able to search for paginated nearby gyms', async () => {
    for (let i = 1; i <= 50; i++) {
      gymRepository.create({
        name: i % 2 === 0 ? 'Near Gym' : 'Far Gym',
        description: '',
        phone: '',
        latitude: i % 2 === 0 ? -5.1602129 : -7.230234,
        longitude: i % 2 === 0 ? -37.3430225 : -38.0178174,
      });
    }

    const { gyms } = await sut.execute({
      userLatitude: -5.1602129,
      userLongitude: -37.3430225,
      page: 2,
    });

    expect(gyms).toHaveLength(5);
    expect(gyms).toEqual(
      gyms.map(() =>
        expect.objectContaining({
          name: 'Near Gym',
          latitude: new Decimal(-5.1602129),
          longitude: new Decimal(-37.3430225),
        })
      )
    );
  });
});
