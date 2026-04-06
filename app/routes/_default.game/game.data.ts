/**
 * Data layer that switches between real DB and in-memory mock.
 * Start with MOCK_DATA=true to skip the database entirely.
 */

import type { ParsedGame, Submission } from './game.server';

export type { ParsedGame, Submission };

const USE_MOCK = process.env.MOCK_DATA === 'true';

type DataModule = {
  findOrCreateDailyGame: (userId?: string) => Promise<ParsedGame>;
  getGame: (id: number) => Promise<ParsedGame>;
  addGameSubmission: (id: number, submission: number[]) => Promise<ParsedGame>;
  getUserStats: (userId: string) => Promise<{
    totalGames: number;
    totalWins: number;
    winPercentage: number;
    currentStreak: number;
    maxStreak: number;
    distribution: Record<number, number>;
  }>;
};

let _mod: DataModule | null = null;

async function getModule(): Promise<DataModule> {
  if (_mod) return _mod;

  if (USE_MOCK) {
    _mod = await import('./game.mock');
  } else {
    _mod = await import('./game.server');
  }
  return _mod;
}

export async function findOrCreateDailyGame(userId?: string) {
  const mod = await getModule();
  return mod.findOrCreateDailyGame(userId);
}

export async function getGame(id: number) {
  const mod = await getModule();
  return mod.getGame(id);
}

export async function addGameSubmission(id: number, submission: number[]) {
  const mod = await getModule();
  return mod.addGameSubmission(id, submission);
}

export async function getUserStats(userId: string) {
  const mod = await getModule();
  return mod.getUserStats(userId);
}
