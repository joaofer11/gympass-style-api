import { CheckIn } from '@prisma/client';
import { IGymRepository } from '@/repositories/IGymRepository';
import { IUserRepository } from '@/repositories/IUserRepository';
import { ICheckInRepository } from '@/repositories/ICheckInRepository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ReachedMaxCheckInPerDay } from './errors/max-check-in-per-day-reached-error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coodinates';
import { ReachedMaxDistanceFromUserToGym } from './errors/reached-max-distance-from-user-to-gym';

interface ICheckInUserServiceInput {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface ICheckInUserServiceOutput {
  checkIn: CheckIn;
}

export class CheckInUserService {
  #userRepository: IUserRepository;
  #checkInRepository: ICheckInRepository;
  #gymRepository: IGymRepository;

  constructor(
    userRepository: IUserRepository,
    checkInRepository: ICheckInRepository,
    gymRepository: IGymRepository
  ) {
    this.#userRepository = userRepository;
    this.#checkInRepository = checkInRepository;
    this.#gymRepository = gymRepository;
  }

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: ICheckInUserServiceInput): Promise<ICheckInUserServiceOutput> {
    const user = await this.#userRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const gym = await this.#gymRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const checkInOnTheSameDate =
      await this.#checkInRepository.findByUserIdOnDate(userId, new Date());

    if (checkInOnTheSameDate) {
      throw new ReachedMaxCheckInPerDay();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    );

    const HUNDRED_METERS = 0.1; // 1 = 1000m = 1km;

    if (distance > HUNDRED_METERS) {
      throw new ReachedMaxDistanceFromUserToGym();
    }

    const checkIn = await this.#checkInRepository.create({
      userId,
      gymId,
    });

    return {
      checkIn,
    };
  }
}
