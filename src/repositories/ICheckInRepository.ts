import { CheckIn, Prisma } from '@prisma/client';

export interface ICheckInRepository {
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
  countByUserId(userId: string): Promise<number>;
}
