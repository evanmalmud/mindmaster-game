import { Code, Game, Prisma } from '@prisma/client';
import { z } from 'zod';

import { db } from '~/services/db.server';

import { createDailyCode, getPuzzleDate } from '../../lib/code';

import { RESULT_MAP, calculateResult } from './game';

export type Submission = {
  code: number[];
  result: number[];
};

export async function addGameSubmission(id: number, submission: number[]) {
  const game = await getGame(id);

  if (game.submissions.length >= game.maxGuesses) {
    throw new Error('The maximum number of guesses has been reached');
  }

  const result = calculateResult(game.code.code, submission);
  const isWinner = result.every(
    (value) => value === RESULT_MAP.correctColorAndSpot,
  );

  const updatedGame = await db.game.update({
    where: {
      id,
    },
    data: {
      isWinner,
      submissions: game.submissions.concat({ code: submission, result }),
    },
    include: {
      code: true,
    },
  });

  return toParsedGame(updatedGame);
}

export async function getGame(id: number) {
  const game = await db.game.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      code: true,
    },
  });

  return toParsedGame(game);
}

/**
 * Finds or creates today's daily puzzle game for a user.
 * If no userId, creates an anonymous daily game (tracked by cookie on the client).
 */
export async function findOrCreateDailyGame(userId?: string) {
  const puzzleDate = getPuzzleDate();

  if (userId) {
    const existing = await db.game.findUnique({
      where: {
        userId_puzzleDate: { userId, puzzleDate },
      },
      include: { code: true },
    });

    if (existing) {
      return toParsedGame(existing);
    }
  }

  return createDailyGame(puzzleDate, userId);
}

async function createDailyGame(puzzleDate: string, userId?: string) {
  const code = createDailyCode(puzzleDate);
  const submissions: Prisma.InputJsonValue[] = [];

  const game = await db.game.create({
    data: {
      isWinner: false,
      maxGuesses: 6,
      submissions,
      puzzleDate,
      code: {
        create: {
          code,
        },
      },
      ...(userId ? { user: { connect: { id: userId } } } : null),
    },
    include: {
      code: true,
    },
  });

  return toParsedGame(game);
}

/**
 * Get user stats for the stats page.
 */
export async function getUserStats(userId: string) {
  const games = await db.game.findMany({
    where: {
      userId,
      puzzleDate: { not: null },
    },
    orderBy: { puzzleDate: 'desc' },
    include: { code: true },
  });

  const completed = games.filter(
    (g) => g.isWinner || parseSubmissions(g.submissions).length >= g.maxGuesses,
  );
  const wins = completed.filter((g) => g.isWinner);

  // Guess distribution (1-6)
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const game of wins) {
    const subs = parseSubmissions(game.submissions);
    const guesses = subs.length;
    if (guesses >= 1 && guesses <= 6) {
      distribution[guesses]++;
    }
  }

  // Streak calculation
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;

  // Sort by date ascending for streak calculation
  const sortedDates = completed
    .filter((g) => g.isWinner && g.puzzleDate)
    .map((g) => g.puzzleDate!)
    .sort();

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = Math.round(
        (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000),
      );
      tempStreak = diffDays === 1 ? tempStreak + 1 : 1;
    }
    maxStreak = Math.max(maxStreak, tempStreak);
  }

  // Check if current streak is still active (includes today or yesterday)
  const today = getPuzzleDate();
  const yesterday = getPuzzleDate(
    new Date(Date.now() - 24 * 60 * 60 * 1000),
  );

  if (sortedDates.length > 0) {
    const lastWinDate = sortedDates[sortedDates.length - 1];
    if (lastWinDate === today || lastWinDate === yesterday) {
      currentStreak = tempStreak;
    }
  }

  return {
    totalGames: completed.length,
    totalWins: wins.length,
    winPercentage: completed.length > 0
      ? Math.round((wins.length / completed.length) * 100)
      : 0,
    currentStreak,
    maxStreak,
    distribution,
  };
}

export type ParsedGame = ReturnType<typeof toParsedGame>;

function toParsedGame(game: Game & { code: Code }) {
  return {
    ...game,
    submissions: parseSubmissions(game.submissions),
  };
}

function parseSubmissions(value: unknown): Submission[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return z
    .array(
      z.object({
        code: z.array(z.number()).length(4),
        result: z.array(z.number()).length(4),
      }),
    )
    .parse(value);
}
