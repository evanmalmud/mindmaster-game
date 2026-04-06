import { PrismaClient } from '@prisma/client';

import { NODE_ENV } from '~/config/env.server';

function createClient() {
  if (process.env.MOCK_DATA === 'true') {
    // Return a dummy client that won't connect — mock layer intercepts all calls
    return {} as PrismaClient;
  }

  const { PrismaPg } = require('@prisma/adapter-pg');
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
