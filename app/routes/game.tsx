import { ActionFunctionArgs } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';

import { Card } from '~/components/ui/card';
import { GameRow } from '~/components/ui/gamerow';
import { getUniqueCode } from '~/lib/code';
import { GameState, calculateResults } from '~/lib/gameStateManager';

type GameSubmit = {
  gameButtonSubmission: number[];
  activeRowSubmission: number;
};

const numberOfGuessesAllowed = 5;

export function loader() {
  const globalGameState: GameState = {
    code: getUniqueCode(),
    activeRow: 0,
    results: [],
    submissions: [],
    gameOver: false,
    isWinner: false,
  };
  return globalGameState;
}

export async function action({ request }: ActionFunctionArgs) {
  //Grab all the form data
  const formData = await request.formData();
  const gameButtons = formData.getAll('GameButton');
  const activeRow = formData.get('ActiveRow');
  const gameStateExport = formData.get('GameState');
  console.log('gameStateExport');
  console.log(gameStateExport);
  const gameState: GameState = JSON.parse(gameStateExport?.toString() ?? '');

  const gameButtonSubmission: number[] = [];
  gameButtons.forEach((key) => gameButtonSubmission.push(Number(key)));

  const activeRowSubmission = Number(activeRow);

  const submissionData: GameSubmit = {
    gameButtonSubmission,
    activeRowSubmission,
  };
  gameState.submissions[submissionData?.activeRowSubmission] =
    submissionData.gameButtonSubmission;
  gameState.results[submissionData?.activeRowSubmission] = calculateResults(
    gameState.code,
    submissionData?.gameButtonSubmission,
  );

  if (
    JSON.stringify(submissionData?.gameButtonSubmission) ==
    JSON.stringify(gameState.code)
  ) {
    // WIN
    gameState.isWinner = true;
    gameState.gameOver = true;
    console.log('WINNER WINNER');
  } else if (gameState.activeRow >= numberOfGuessesAllowed) {
    // LOSE
    gameState.gameOver = true;
    console.log('LOSER LOSER');
  }
  // NEXT GUESS
  gameState.activeRow++;

  return gameState;
}

export default function GameScreen() {
  const gameLoaderState = useLoaderData<typeof loader>();
  let gameState = useActionData<typeof action>();
  if (gameState == undefined) {
    gameState = gameLoaderState;
  }

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
