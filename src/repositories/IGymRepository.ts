import { Gym, Prisma } from '@prisma/client';

export interface IGymQuery {
  name: string;
  description?: string;
}

export interface IFindManyNearbyParams {
  latitude: number;
  longitude: number;
  page: number;
}

export interface IGymRepository {
  findById(id: string): Promise<Gym | null>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
  findMany(query: IGymQuery, page: number): Promise<Gym[]>;
  findManyNearby(params: IFindManyNearbyParams): Promise<Gym[]>;
}
