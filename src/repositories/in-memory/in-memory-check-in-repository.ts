import { randomUUID } from 'node:crypto';
import { CheckIn, Prisma } from '@prisma/client';
import { ICheckInRepository } from '../ICheckInRepository';

export class InMemoryCheckInRepository implements ICheckInRepository {
  items: CheckIn[] = [];

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.userId === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const twentyThreeHours = 1000 * 60 * 60 * 23;
    const fiftyNineMinutes = 1000 * 60 * 59;
    const fiftyNineSeconds = 1000 * 59;
    const nineHundredNinetyNineMilliseconds = 999;

    const oneDay =
      twentyThreeHours +
      fiftyNineMinutes +
      fiftyNineSeconds +
      nineHundredNinetyNineMilliseconds;

    console.log({ oneDay });

    return (
      this.items.find(
        (item) =>
          item.userId === userId &&
          date.getTime() - item.createdAt.getTime() <= oneDay
      ) ?? null
    );
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: data.id ?? randomUUID(),
      userId: data.userId,
      gymId: data.gymId,
      createdAt: new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
    };

    this.items.push(checkIn);

    return checkIn;
  }
}
