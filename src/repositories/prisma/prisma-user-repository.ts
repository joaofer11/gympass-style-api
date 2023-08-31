import { prisma } from '@/db/prisma';
import { Prisma } from '@prisma/client';
import { IUserRepository } from '../IUserRepository';

export class PrismaUserRepository implements IUserRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}
