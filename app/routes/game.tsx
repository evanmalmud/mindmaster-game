import { motion } from 'framer-motion';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';

import { Card } from '~/components/ui/card';
import { getUniqueCode } from '~/lib/code';
import { GameRow } from '~/components/ui/gamerow';
import { useState } from 'react';

interface GameSubmit {
  gameButtonSubmission: number[];
  activeRowSubmission: number;
}

interface GameState {
  activeRow: number;
  results: number[][];
  submissions: number[][];
}

const code = getUniqueCode();
const numberOfGuessesAllowed = 5;

export function loader() {
  //const code = getUniqueCode();
  console.log('code: ');
  console.log(code);

  return json({ code });
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
  const { code } = useLoaderData<typeof loader>();

  const [activeRow, setActiveRowState] = useState(0);

  let submissionData = useActionData<typeof action>();

  if (submissionData?.activeRowSubmission == undefined) {
    //Submit never hit
  } else {
    if (submissionData?.activeRowSubmission == activeRow) {
      // We just submitted a new row!
      console.log(code);
      console.log(submissionData?.gameButtonSubmission);
      if (
        JSON.stringify(submissionData?.gameButtonSubmission) ==
        JSON.stringify(code)
      ) {
        // WIN
        console.log('WINNER WINNER');
      } else if (activeRow >= numberOfGuessesAllowed) {
        // LOSE
        console.log('LOSER LOSER');
      } else {
        // NEXT GUESS
        setActiveRowState(activeRow + 1);
      }
    }
  }

  console.log('The active row is' + activeRow);

  const gameRows = [];
  for (let i = 0; i < numberOfGuessesAllowed; i++) {
    gameRows.push({ index: i, isActive: i === activeRow });
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

        <div>{code.toString()}</div>

        <Card
          className={`box-border flex min-h-96 min-w-full flex-col gap-2 rounded border-solid border-black bg-white p-2`}
        >
          {gameRows.map((row) => (
            <GameRow
              activeRow={activeRow}
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
