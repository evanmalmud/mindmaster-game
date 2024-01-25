import type { PrismaClient } from '@prisma/client';

declare global {
  namespace globalThis {
    // eslint-disable-next-line no-var
    var __db: PrismaClient | undefined;
  }
}

export {};
