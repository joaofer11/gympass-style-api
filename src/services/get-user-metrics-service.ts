import { ICheckInRepository } from '@/repositories/ICheckInRepository';

interface IGetUserMetricsServiceInput {
  userId: string;
}

interface IGetUserMetricsServiceOutput {
  count: number;
}

export class GetUserMetricsService {
  #checkInRepository: ICheckInRepository;

  constructor(checkInRepository: ICheckInRepository) {
    this.#checkInRepository = checkInRepository;
  }

  async execute({
    userId,
  }: IGetUserMetricsServiceInput): Promise<IGetUserMetricsServiceOutput> {
    const count = await this.#checkInRepository.countByUserId(userId);

    return {
      count,
    };
  }
}
