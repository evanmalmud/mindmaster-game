import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { z } from 'zod';

import {
  addGameSubmission,
  createGame,
} from '~/routes/_default.game/game.server';
import type {
  ParsedGame,
  Submission,
} from '~/routes/_default.game/game.server';

export async function loader() {
  const game = await createGame();

  return json(toGameState(game));
}

export type GameRouteLoader = typeof loader;

type ActionResponse = {
  ok: boolean;
  gameState: Awaited<GameState> | null;
};

export async function action({ request }: ActionFunctionArgs) {
  const response: ActionResponse = {
    ok: true,
    gameState: null,
  };

  try {
    const formData = await request.formData();

    // Validate inputs
    const { gameId, submission } = z
      .object({
        gameId: z.number(),
        submission: z.array(z.number()).length(4),
      })
      .parse({
        gameId: Number(formData.get('id')),
        submission: formData.getAll('answer').map((x) => Number(x)),
      });

    const game = await addGameSubmission(gameId, submission);
    response.gameState = toGameState(game);

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

function toGameState(game: Awaited<ReturnType<typeof createGame>>): GameState {
  const isGameOver =
    game.isWinner || game.submissions.length >= game.maxGuesses;

  return {
    activeRow: isGameOver ? -1 : game.submissions.length,
    game: {
      ...game,
      // If game isn't over, we attach a new submission for the user to interact
      // with
      submissions: isGameOver
        ? game.submissions
        : game.submissions.concat(createNewSubmission()),
    },
    isGameOver,
  };
}

function createNewSubmission(): Submission {
  return {
    code: [0, 0, 0, 0],
    result: [],
  };
}
