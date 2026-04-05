import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { NODE_ENV } from '~/config/env.server';

function createClient() {
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
