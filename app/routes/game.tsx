import { motion } from 'framer-motion';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';

import { Card } from '~/components/ui/card';
import { getUniqueCode } from '~/lib/code';
import { GameState, calculateResults } from '~/lib/gameStateManager';
import { GameRow } from '~/components/ui/gamerow';
import { useState } from 'react';

interface GameSubmit {
  gameButtonSubmission: number[];
  activeRowSubmission: number;
}

const numberOfGuessesAllowed = 5;

export let globalGameState: GameState = {
  code: getUniqueCode(),
  activeRow: 0,
  results: [],
  submissions: [],
  gameOver: false,
  isWinner: false,
};

export function loader() {
  return globalGameState;
}

export async function action({ request }: ActionFunctionArgs) {
  //Grab all the form data
  const formData = await request.formData();
  const gameButtons = formData.getAll('GameButton');
  const activeRow = formData.get('ActiveRow');

  let gameButtonSubmission: number[] = [];
  gameButtons.forEach((key) => gameButtonSubmission.push(Number(key)));

  let activeRowSubmission = Number(activeRow);

  let submissionData: GameSubmit = {
    gameButtonSubmission,
    activeRowSubmission,
  };
  globalGameState.submissions[submissionData?.activeRowSubmission] =
    submissionData.gameButtonSubmission;
  globalGameState.results[submissionData?.activeRowSubmission] =
    calculateResults(
      globalGameState.code,
      submissionData?.gameButtonSubmission,
    );

  if (
    JSON.stringify(submissionData?.gameButtonSubmission) ==
    JSON.stringify(globalGameState.code)
  ) {
    // WIN
    globalGameState.isWinner = true;
    globalGameState.gameOver = true;
    console.log('WINNER WINNER');
  } else if (globalGameState.activeRow >= numberOfGuessesAllowed) {
    // LOSE
    globalGameState.gameOver = true;
    console.log('LOSER LOSER');
  }
  // NEXT GUESS
  globalGameState.activeRow++;

  return globalGameState;
}

export default function GameScreen() {
  let gameState = useActionData<typeof action>();

  const gameRows = [];
  for (let i = 0; i < numberOfGuessesAllowed; i++) {
    gameRows.push({ index: i, isActive: i === gameState?.activeRow });
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center">
      <div className="flex w-full max-w-lg flex-col items-center">
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: -700 }}
          transition={{ duration: 0.5 }}
          className="font-display text-6xl uppercase"
        >
          Mastermind
        </motion.h1>

        <div>{gameState?.code.toString()}</div>

        <Card
          className={`box-border flex min-h-96 min-w-full flex-col gap-2 rounded border-solid border-black bg-white p-2`}
        >
          {gameRows.map((row) => (
            <GameRow
              key={row.index}
              index={row.index}
              isActive={row.isActive}
            />
          ))}
        </Card>
      </div>
    </main>
  );
}
