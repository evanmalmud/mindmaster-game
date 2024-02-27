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

const gameState: GameState = {
  code: getUniqueCode(),
  activeRow: 0,
  results: [],
  submissions: [],
};

export function loader() {
  return gameState;
}

export async function action({ request }: ActionFunctionArgs) {
  //Grab all the form data
  const formData = await request.formData();
  const gameButtons = formData.getAll('GameButton');
  const activeRow = formData.get('ActiveRow');

  let gameButtonSubmission: number[] = [];
  gameButtons.forEach((key) => gameButtonSubmission.push(Number(key)));

  let activeRowSubmission = Number(activeRow);

  let submission: GameSubmit = {
    gameButtonSubmission,
    activeRowSubmission,
  };

  return submission;
}

export default function GameScreen() {
  const gameState = useLoaderData<typeof loader>();

  const [state, setGameState] = useState(gameState);

  let submissionData = useActionData<typeof action>();

  if (submissionData?.activeRowSubmission == undefined) {
    //Submit never hit
  } else {
    if (submissionData?.activeRowSubmission == state.activeRow) {
      // We just submitted a new row!
      let updatedState = { ...state };
      updatedState.submissions[submissionData?.activeRowSubmission] =
        submissionData?.gameButtonSubmission;
      updatedState.results[submissionData?.activeRowSubmission] =
        calculateResults(gameState.code, submissionData?.gameButtonSubmission);
      console.log(
        updatedState.submissions[submissionData?.activeRowSubmission],
      );
      console.log(updatedState.results[submissionData?.activeRowSubmission]);
      if (
        JSON.stringify(submissionData?.gameButtonSubmission) ==
        JSON.stringify(gameState.code)
      ) {
        // WIN
        console.log('WINNER WINNER');
      } else if (state.activeRow >= numberOfGuessesAllowed) {
        // LOSE
        console.log('LOSER LOSER');
      }
      // NEXT GUESS
      let newActiveRow = { activeRow: state.activeRow + 1 };
      console.log('ACTIVE ROW ' + newActiveRow);
      setGameState((state: GameState) => ({
        ...state,
        ...newActiveRow,
      }));
    }
  }

  const gameRows = [];
  for (let i = 0; i < numberOfGuessesAllowed; i++) {
    gameRows.push({ index: i, isActive: i === state.activeRow });
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

        <div>{gameState.code.toString()}</div>

        <Card
          className={`box-border flex min-h-96 min-w-full flex-col gap-2 rounded border-solid border-black bg-white p-2`}
        >
          {gameRows.map((row) => (
            <GameRow
              activeRow={state.activeRow}
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
