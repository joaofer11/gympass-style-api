import { prisma } from '@/db/prisma';
import { Gym, Prisma } from '@prisma/client';
import {
  IFindManyNearbyParams,
  IGymQuery,
  IGymRepository,
} from '../IGymRepository';

export class PrismaGymRepository implements IGymRepository {
  async findById(id: string) {
    return await prisma.gym.findUnique({ where: { id } });
  }

  async create(data: Prisma.GymCreateInput) {
    return await prisma.gym.create({
      data,
    });
  }

  async findMany(query: IGymQuery, page: number) {
    return await prisma.gym.findMany({
      where: {
        name: { contains: query.name },
      },
      take: 20,
      skip: (page - 1) * 20,
    });
  }
  async findManyNearby({ latitude, longitude }: IFindManyNearbyParams) {
    return await prisma.$queryRaw<Gym[]>`
      SELECT * from gym
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;
  }
}
