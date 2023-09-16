import { randomUUID } from 'node:crypto';
import { Gym, Prisma } from '@prisma/client';
import { IGymQuery, IGymRepository } from '../IGymRepository';
import { Decimal } from '@prisma/client/runtime/library';

export class InMemoryGymRepository implements IGymRepository {
  items: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      phone: data.phone ?? null,
      description: data.description ?? null,
      latitude: new Decimal(+data.latitude),
      longitude: new Decimal(+data.longitude),
    };

    this.items.push(gym);

    return gym;
  }
  async findMany(query: IGymQuery, page: number) {
    const queryAsArr = Object.entries(query) as [keyof typeof query, string][];

    return this.items
      .filter((item) =>
        queryAsArr.every(([key, value]) => item[key]?.includes(value))
      )
      .slice((page - 1) * 20, page * 20);
  }

  async findById(id: string) {
    return this.items.find((item) => item.id === id) ?? null;
  }
}
