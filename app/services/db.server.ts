import type { PrismaClient } from '@prisma/client';

import { NODE_ENV } from '~/config/env.server';

function createClient() {
  if (process.env.MOCK_DATA === 'true') {
    return {} as PrismaClient;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaPg } = require('@prisma/adapter-pg');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require('@prisma/client');
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
