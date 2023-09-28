import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateNewDatabaseUrlSchema = (schemaName) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a valid schema name.');
  }

  return process.env.DATABASE_URL.replace(/schema=\w+/, `schema=${schemaName}`);
};

export default {
  name: 'e2e',
  transformMode: 'ssr',
  async setup() {
    // This environment's function will be executed before each test file.

    const schemaName = randomUUID();
    const newDatabaseSchema = generateNewDatabaseUrlSchema(schemaName);

    process.env.DATABASE_URL = newDatabaseSchema;

    execSync('npx prisma migrate deploy');

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`
        );
        await prisma.$disconnect();
      },
    };
  },
};
