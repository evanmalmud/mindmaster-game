import { createCookie } from '@remix-run/node';

import { SESSION_SECRET } from '~/config/env.server';

export type CookieStats = {
  currentGameId: number | null;
  currentPuzzleDate: string | null;
  totalGames: number;
  totalWins: number;
  currentStreak: number;
  maxStreak: number;
  lastWinDate: string | null;
  distribution: Record<number, number>;
  lastSolveTime: number | null; // seconds
  bestSolveTime: number | null; // seconds
};

const defaultStats: CookieStats = {
  currentGameId: null,
  currentPuzzleDate: null,
  totalGames: 0,
  totalWins: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastWinDate: null,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  lastSolveTime: null,
  bestSolveTime: null,
};

export const statsCookie = createCookie('mindmaster-stats', {
  maxAge: 365 * 24 * 60 * 60, // 1 year
  sameSite: 'lax',
  path: '/',
  httpOnly: true,
  secrets: [SESSION_SECRET],
});

export async function getStatsFromCookie(
  request: Request,
): Promise<CookieStats> {
  const cookie = await statsCookie.parse(request.headers.get('Cookie'));
  if (!cookie || typeof cookie !== 'object') {
    return { ...defaultStats, distribution: { ...defaultStats.distribution } };
  }
  return {
    ...defaultStats,
    ...cookie,
    distribution: {
      ...defaultStats.distribution,
      ...(cookie.distribution ?? {}),
    },
  };
}

export function updateCookieStatsAfterGame(
  stats: CookieStats,
  isWinner: boolean,
  guesses: number,
  puzzleDate: string,
  solveTimeSeconds?: number,
): CookieStats {
  const updated = { ...stats, distribution: { ...stats.distribution } };

  updated.totalGames++;
  // Keep currentGameId/puzzleDate so the cookie knows the game is done
  // but mark it as completed by setting the date still

  if (isWinner) {
    updated.totalWins++;
    updated.distribution[guesses] = (updated.distribution[guesses] ?? 0) + 1;

    if (solveTimeSeconds) {
      updated.lastSolveTime = solveTimeSeconds;
      if (!updated.bestSolveTime || solveTimeSeconds < updated.bestSolveTime) {
        updated.bestSolveTime = solveTimeSeconds;
      }
    }

    // Streak logic
    if (updated.lastWinDate) {
      const prev = new Date(updated.lastWinDate);
      const curr = new Date(puzzleDate);
      const diffDays = Math.round(
        (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000),
      );
      updated.currentStreak = diffDays === 1 ? updated.currentStreak + 1 : 1;
    } else {
      updated.currentStreak = 1;
    }

    updated.maxStreak = Math.max(updated.maxStreak, updated.currentStreak);
    updated.lastWinDate = puzzleDate;
  } else {
    updated.currentStreak = 0;
  }

  return updated;
}
