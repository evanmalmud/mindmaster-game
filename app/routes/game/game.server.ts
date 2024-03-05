import type { Code, Game } from '@prisma/client';
import type { JsonArray, JsonValue } from '@prisma/client/runtime/library';
import { z } from 'zod';

import { db } from '~/services/db.server';

import { createCode } from '../../lib/code';

export type Submission = {
  code: number[];
  result: number[];
};

const RESULT_MAP = {
  incorrect: -1,
  correctColor: 0,
  correctColorAndSpot: 1,
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

export async function findMostRecentUnfinishedGameByUserId(userId?: string) {
  if (!userId) {
    return createGame(userId);
  }

  const games = await db.game.findMany({
    where: {
      userId,
      isWinner: false,
    },
    include: {
      code: true,
    },
  });

  const firstUnfinishedGame = games
    .map((g) => ({ ...g, submissions: parseSubmissions(g.submissions) }))
    .find((g) => g.submissions.length < g.maxGuesses);

  return firstUnfinishedGame ?? createGame(userId);
}

export async function createGame(userId?: string) {
  const code = createCode();
  const submissions: JsonArray = [];

  const game = await db.game.create({
    data: {
      isWinner: false,
      maxGuesses: 5,
      submissions,
      code: {
        create: {
          code,
        },
      },
      // If user id exists, connect the game to a user
      ...(userId ? { user: { connect: { id: userId } } } : null),
    },
    include: {
      code: true,
    },
  });

  return toParsedGame(game);
}

/**
 * Calculates the results and returns an array of numbers that represent the 3
 * possible states:
 *
 * 1: Correct color and spot
 * 0: Correct color
 * -1: Incorrect
 *
 * To keep it in a single loop, we just flip the code value to -1 which can't be
 * matched again by a submission value.
 */
export function calculateResult(code: number[], submission: number[]) {
  const result: number[] = Array(code.length);
  const temp = [...code];

  for (let i = 0; i < submission.length; i++) {
    if (code[i] === submission[i]) {
      result[i] = RESULT_MAP.correctColorAndSpot;
      temp[i] = -1;
      continue;
    }

    const misplacedIndex = temp.indexOf(submission[i]);
    if (misplacedIndex > -1) {
      result[i] = RESULT_MAP.correctColor;
      temp[misplacedIndex] = -1;
      continue;
    }

    result[i] = RESULT_MAP.incorrect;
  }

  // Sort by descending order to have correct answers first
  return result.sort((a, b) => b - a);
}

export type ParsedGame = ReturnType<typeof toParsedGame>;

function toParsedGame(game: Game & { code: Code }) {
  return {
    ...game,
    submissions: parseSubmissions(game.submissions),
  };
}

function parseSubmissions(value: JsonValue): Submission[] {
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
