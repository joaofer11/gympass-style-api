import { randomUUID } from 'node:crypto';
import { Prisma, User } from '@prisma/client';
import { IUserRepository } from '../IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
  items: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
    };

    this.items.push(user);

    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    return user ?? null;
  }
}
