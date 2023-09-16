import { it, expect, describe, beforeEach } from 'vitest';

import { RegisterGymService } from './register-gym-service';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository';

describe('Register User Service', () => {
  let gymRepository: InMemoryGymRepository;
  let sut: RegisterGymService;

  beforeEach(() => {
    gymRepository = new InMemoryGymRepository();
    sut = new RegisterGymService(gymRepository);
  });

  it('should be able to register a gym', async () => {
    const { gym } = await sut.execute({
      name: 'John Doe Gym',
      description: undefined,
      phone: undefined,
      latitude: 0,
      longitude: 0,
    });

    expect(gym).toEqual(
      expect.objectContaining({
        id: gym.id,
        name: gym.name,
      })
    );
  });
});
