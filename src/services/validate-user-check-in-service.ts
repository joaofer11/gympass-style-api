import { CheckIn } from '@prisma/client';
import { ICheckInRepository } from '@/repositories/ICheckInRepository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface IValidateUserCheckInServiceRepositories {
  checkInRepository: ICheckInRepository;
}

interface IValidateUserCheckInServiceInput {
  checkInId: string;
}

interface IValidateUserCheckInServiceOutput {
  checkIn: CheckIn;
}

export class ValidateUserCheckInService {
  #checkInRepository: ICheckInRepository;

  constructor({ checkInRepository }: IValidateUserCheckInServiceRepositories) {
    this.#checkInRepository = checkInRepository;
  }

  async execute({
    checkInId,
  }: IValidateUserCheckInServiceInput): Promise<IValidateUserCheckInServiceOutput> {
    const checkIn = await this.#checkInRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    checkIn.updatedAt = new Date();

    await this.#checkInRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
