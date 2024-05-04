import { Code, Game } from '@prisma/client';
import type { JsonArray, JsonValue } from '@prisma/client/runtime/library';
import { z } from 'zod';

import { db } from '~/services/db.server';

import { createCode } from '../../lib/code';

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
      maxGuesses: 6,
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
