import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { z } from 'zod';

import { getPuzzleDate, getPuzzleNumber } from '~/lib/code';
import { authenticator } from '~/services/auth.server';
import {
  getStatsFromCookie,
  statsCookie,
  updateCookieStatsAfterGame,
} from '~/services/stats-cookie.server';

import {
  addGameSubmission,
  findOrCreateDailyGame,
  getGame,
} from '~/routes/_default.game/game.data';
import type {
  ParsedGame,
  Submission,
} from '~/routes/_default.game/game.data';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  const puzzleDate = getPuzzleDate();
  const puzzleNumber = getPuzzleNumber(puzzleDate);

  if (user) {
    const game = await findOrCreateDailyGame(user.id);
    return json({ ...toGameState(game), puzzleNumber, puzzleDate });
  }

  // Anonymous user: check cookie for an existing game
  const stats = await getStatsFromCookie(request);

  if (stats.currentGameId && stats.currentPuzzleDate === puzzleDate) {
    try {
      const game = await getGame(stats.currentGameId);
      return json({ ...toGameState(game), puzzleNumber, puzzleDate });
    } catch {
      // Game not found, create a new one
    }
  }

  // Create new anonymous game and store its ID in the cookie
  const game = await findOrCreateDailyGame();
  stats.currentGameId = game.id;
  stats.currentPuzzleDate = puzzleDate;

  return json(
    { ...toGameState(game), puzzleNumber, puzzleDate },
    {
      headers: {
        'Set-Cookie': await statsCookie.serialize(stats),
      },
    },
  );
}

export type GameRouteLoader = typeof loader;

type ActionResponse = {
  ok: boolean;
  gameState: Awaited<GameState> | null;
  solveTimeSeconds?: number;
};

export async function action({ request }: ActionFunctionArgs) {
  const response: ActionResponse = {
    ok: true,
    gameState: null,
  };

  try {
    const formData = await request.formData();

    const { gameId, submission } = z
      .object({
        gameId: z.number(),
        submission: z.array(z.number()).length(4),
      })
      .parse({
        gameId: Number(formData.get('id')),
        submission: formData.getAll('answer').map((x) => Number(x)),
      });

    const solveTimeSeconds = Number(formData.get('elapsed')) || 0;

    const game = await addGameSubmission(gameId, submission);
    response.gameState = toGameState(game);

    if (response.gameState.isGameOver) {
      response.solveTimeSeconds = solveTimeSeconds;
    }

    // If anonymous user and game just ended, update cookie stats
    const user = await authenticator.isAuthenticated(request);
    if (!user && response.gameState.isGameOver) {
      const stats = await getStatsFromCookie(request);
      const completedSubs = game.submissions.filter((s) => s.result.length > 0);
      const puzzleDate = game.puzzleDate ?? getPuzzleDate();
      const updated = updateCookieStatsAfterGame(
        stats,
        game.isWinner,
        completedSubs.length,
        puzzleDate,
        game.isWinner ? solveTimeSeconds : undefined,
      );

      return json(response, {
        headers: {
          'Set-Cookie': await statsCookie.serialize(updated),
        },
      });
    }

    return json(response);
  } catch (e) {
    console.log(e);

    response.ok = false;
    return json(response);
  }
}

export type GameRouteAction = typeof action;

export function useGameRouteLoader() {
  return useLoaderData<typeof loader>();
}

export function useGameRouteAction() {
  return useActionData<typeof action>();
}

export function useGameState() {
  const initialGameState = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return actionData?.gameState ?? initialGameState;
}

type GameState = {
  activeRow: number;
  game: ParsedGame;
  isGameOver: boolean;
};

function toGameState(game: ParsedGame): GameState {
  const isGameOver =
    game.isWinner || game.submissions.length >= game.maxGuesses;

  // Carry forward the previous guess's colors for the new active row
  const lastGuess =
    game.submissions.length > 0
      ? game.submissions[game.submissions.length - 1].code
      : [0, 0, 0, 0];

  return {
    activeRow: isGameOver ? -1 : game.submissions.length,
    game: {
      ...game,
      code: isGameOver ? game.code : { id: game.code.id, code: [] },
      submissions: isGameOver
        ? game.submissions
        : game.submissions.concat({ code: [...lastGuess], result: [] }),
    },
    isGameOver,
  };
}
