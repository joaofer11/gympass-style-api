import { CheckIn } from '@prisma/client';
import { ICheckInRepository } from '@/repositories/ICheckInRepository';

interface IFetchUserCheckInsHistoryServiceInput {
  userId: string;
  page?: number;
}

interface IFetchUserCheckInsHistoryServiceOutput {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryService {
  #checkInRepository: ICheckInRepository;

  constructor(checkInRepository: ICheckInRepository) {
    this.#checkInRepository = checkInRepository;
  }

  async execute({
    userId,
    page,
  }: IFetchUserCheckInsHistoryServiceInput): Promise<IFetchUserCheckInsHistoryServiceOutput> {
    const checkIns = await this.#checkInRepository.findManyByUserId(
      userId,
      page ?? 1
    );

    return {
      checkIns,
    };
  }
}
