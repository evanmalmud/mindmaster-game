import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import { NODE_ENV } from '~/config/env.server';

function createClient() {
  if (process.env.MOCK_DATA === 'true') {
    return {} as PrismaClient;
  }

  const adapter = new PrismaPg(process.env.DATABASE_URL!);
  return new PrismaClient({ adapter });
}

let db: PrismaClient;

if (NODE_ENV === 'production') {
  db = createClient();
} else {
  if (!global.__db) {
    global.__db = createClient();
  }
  db = global.__db;
}

export { db };
