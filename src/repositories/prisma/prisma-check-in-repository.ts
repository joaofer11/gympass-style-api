import { prisma } from '@/db/prisma';
import { CheckIn, Prisma } from '@prisma/client';
import { ICheckInRepository } from '../ICheckInRepository';

export class PrismaCheckInRepository implements ICheckInRepository {
  async findManyByUserId(userId: string, page: number) {
    return await prisma.checkIn.findMany({
      where: { userId },
      take: 20,
      skip: (page - 1) * 20,
    });
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    return await prisma.checkIn.create({
      data,
    });
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    return await prisma.checkIn.findFirst({
      where: {
        userId,
        createdAt: {
          equals: new Date(
            date.getFullYear(),
            date.getMonth() - 1,
            date.getDate()
          ),
        },
      },
    });
  }

  async countByUserId(userId: string) {
    return await prisma.checkIn.count({ where: { userId } });
  }

  async findById(id: string) {
    return await prisma.checkIn.findUnique({ where: { id } });
  }

  async save(checkIn: CheckIn) {
    return await prisma.checkIn.update({
      where: { id: checkIn.id },
      data: checkIn,
    });
  }
}
