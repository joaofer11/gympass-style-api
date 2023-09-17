import { CheckIn } from '@prisma/client';
import { ICheckInRepository } from '@/repositories/ICheckInRepository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { TooLateCheckInValidationError } from './errors/too-late-check-in-validation-error';

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

    const TWENTY_MINUTES_IN_MS = 1000 * 60 * 20;

    const checkInCreationInMs = checkIn.createdAt.getTime();

    const elapsedTimeFromCheckInCreation =
      new Date().getTime() - checkInCreationInMs;

    if (elapsedTimeFromCheckInCreation > TWENTY_MINUTES_IN_MS) {
      throw new TooLateCheckInValidationError();
    }

    checkIn.updatedAt = new Date();

    await this.#checkInRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
