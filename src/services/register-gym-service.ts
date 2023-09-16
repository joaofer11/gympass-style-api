import { Gym } from '@prisma/client';
import { IGymRepository } from '@/repositories/IGymRepository';

interface IRegisterGymServiceInput {
  name: string;
  description?: string;
  phone?: string;
  latitude: number;
  longitude: number;
}

interface IRegisterGymServiceOutput {
  gym: Gym;
}

export class RegisterGymService {
  constructor(private gymRepository: IGymRepository) {}

  async execute({
    name,
    description,
    phone,
    latitude,
    longitude,
  }: IRegisterGymServiceInput): Promise<IRegisterGymServiceOutput> {
    const gym = await this.gymRepository.create({
      name,
      description,
      phone,
      latitude,
      longitude,
    });

    return {
      gym,
    };
  }
}
