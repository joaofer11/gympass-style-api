import { Gym } from '@prisma/client';
import { IGymRepository } from '@/repositories/IGymRepository';

interface ISearchGymsServiceRepositories {
  gymRepository: IGymRepository;
}

interface ISearchGymsServiceInput {
  page?: number;
  query: {
    name: string;
    description?: string;
  };
}

interface ISearchGymsServiceOutput {
  gyms: Gym[];
}

export class SearchGymsService {
  #gymRepository: IGymRepository;

  constructor({ gymRepository }: ISearchGymsServiceRepositories) {
    this.#gymRepository = gymRepository;
  }

  async execute({
    query,
    page,
  }: ISearchGymsServiceInput): Promise<ISearchGymsServiceOutput> {
    const gyms = await this.#gymRepository.findMany(query, page ?? 1);

    return {
      gyms,
    };
  }
}
