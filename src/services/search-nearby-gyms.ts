import { Gym } from '@prisma/client';
import { IGymRepository } from '@/repositories/IGymRepository';

interface ISearchNearbyGymsRepositories {
  gymRepository: IGymRepository;
}

interface ISearchNearbyGymsInput {
  userLatitude: number;
  userLongitude: number;
  page?: number;
}

interface ISearchNearbyGymsOutput {
  gyms: Gym[];
}

export class SearchNearbyGyms {
  #gymRepository: IGymRepository;

  constructor({ gymRepository }: ISearchNearbyGymsRepositories) {
    this.#gymRepository = gymRepository;
  }

  async execute({
    userLatitude,
    userLongitude,
    page,
  }: ISearchNearbyGymsInput): Promise<ISearchNearbyGymsOutput> {
    const gyms = await this.#gymRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
      page: page ?? 1,
    });

    return {
      gyms,
    };
  }
}
