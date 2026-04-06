import { createDailyCode, getPuzzleDate } from '../../lib/code';

import { RESULT_MAP, calculateResult } from './game';
import type { ParsedGame, Submission } from './game.server';

/**
 * In-memory game store for dev without a database.
 * Games persist for the lifetime of the dev server process.
 */
const games = new Map<number, ParsedGame>();
let nextId = 1;

function createMockGame(puzzleDate: string): ParsedGame {
  const code = createDailyCode(puzzleDate);
  const id = nextId++;
  const game: ParsedGame = {
    id,
    maxGuesses: 6,
    isWinner: false,
    submissions: [],
    puzzleDate,
    createdAt: new Date() as unknown as string,
    codeId: id,
    code: { id, code },
    userId: null,
  };
  games.set(id, game);
  return game;
}

export async function findOrCreateDailyGame(_userId?: string): Promise<ParsedGame> {
  const puzzleDate = getPuzzleDate();

  // Find existing game for today
  for (const game of games.values()) {
    if (game.puzzleDate === puzzleDate) {
      return game;
    }
  }

  return createMockGame(puzzleDate);
}

export async function getGame(id: number): Promise<ParsedGame> {
  const game = games.get(id);
  if (!game) throw new Error(`Game ${id} not found`);
  return game;
}

export async function addGameSubmission(id: number, submission: number[]): Promise<ParsedGame> {
  const game = games.get(id);
  if (!game) throw new Error(`Game ${id} not found`);

  if (game.submissions.length >= game.maxGuesses) {
    throw new Error('The maximum number of guesses has been reached');
  }

  const result = calculateResult(game.code.code, submission);
  const isWinner = result.every(
    (value) => value === RESULT_MAP.correctColorAndSpot,
  );

  game.submissions = game.submissions.concat({ code: submission, result });
  game.isWinner = isWinner;

  return game;
}

export async function getUserStats(_userId: string) {
  // Return sample stats for dev preview
  return {
    totalGames: 12,
    totalWins: 9,
    winPercentage: 75,
    currentStreak: 3,
    maxStreak: 5,
    distribution: { 1: 0, 2: 1, 3: 3, 4: 3, 5: 1, 6: 1 } as Record<number, number>,
  };
}
