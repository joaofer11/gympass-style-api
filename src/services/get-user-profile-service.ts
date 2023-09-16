import { User } from '@prisma/client';
import { IUserRepository } from '@/repositories/IUserRepository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface IGetUserProfileServiceInput {
  userId: string;
}

interface IGetUserProfileServiceOutput {
  user: User;
}

export class GetUserProfileService {
  #userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.#userRepository = userRepository;
  }

  async execute({
    userId,
  }: IGetUserProfileServiceInput): Promise<IGetUserProfileServiceOutput> {
    const user = await this.#userRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}
