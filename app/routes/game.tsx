/* eslint-disable react-hooks/rules-of-hooks */
import { ActionFunctionArgs } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { motion, useAnimationControls } from 'framer-motion';

import { Card } from '~/components/ui/card';
import { GameRow } from '~/components/ui/gamerow';
import { getUniqueCode } from '~/lib/code';
import { GameState, calculateResults } from '~/lib/gameStateManager';
import { cn } from '~/utils';

import * as defaults from '../lib/constants';

type GameSubmit = {
  gameButtonSubmission: number[];
  activeRowSubmission: number;
};

const numberOfGuessesAllowed = 5;

export function loader() {
  const gameState: GameState = {
    code: getUniqueCode(),
    activeRow: 0,
    results: [],
    submissions: [],
    gameOver: false,
    isWinner: false,
  };
  // TODO: REMOVE
  console.log('TESTING CODE:');
  console.log(gameState.code);
  return gameState;
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
  } else if (gameState.activeRow >= numberOfGuessesAllowed - 1) {
    // LOSE
    gameState.gameOver = true;
  }
  // NEXT GUESS
  gameState.activeRow++;

  return gameState;
}

export function useloadGameState() {
  const gameLoaderState = useLoaderData<typeof loader>();
  let gameState = useActionData<typeof action>();
  if (gameState == undefined) {
    gameState = gameLoaderState;
  }

  return gameState;
}

export default function GameScreen() {
  const gameState = useloadGameState();

  const gameRows = [];
  for (let i = 0; i < numberOfGuessesAllowed; i++) {
    gameRows.push({ index: i, isActive: i === gameState?.activeRow });
  }

  return (
    <main>
      <div className="flex min-h-dvh flex-col items-center justify-center">
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
        <WinLossFooter></WinLossFooter>
      </div>
    </main>
  );
}

export function WinLossFooter() {
  const gameState = useloadGameState();
  const controls = useAnimationControls();

  const wrapperVariants = {
    hidden: {
      opacity: 0,
      y: 300,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const gameButtons = [];

  for (let i = 0; i < 4; i++) {
    gameButtons.push({
      index: i,
      colorIndex: 1,
    });
  }

  let footerString = 'LOSS';
  if (gameState.isWinner) {
    footerString = 'WINNER';
  }
  if (gameState.gameOver) {
    for (let i = 0; i < 4; i++) {
      gameButtons[i].colorIndex = gameState.code[i];
    }
    controls.start('visible');
  }

  return (
    <motion.div
      variants={wrapperVariants}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.5 }}
    >
      <div className={cn('flex flex-col justify-center gap-2')}>
        <h1 className="text-center font-display text-6xl uppercase">
          {footerString}
        </h1>
        <div className="flex flex-row gap-2">
          {gameButtons.map((row) => (
            <WinLossAnswer key={row.index} colorIndex={row.colorIndex} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function WinLossAnswer({ colorIndex }: { colorIndex: number }) {
  return (
    <>
      <button
        type="button"
        className={cn(
          'size-24 rounded-full border border-solid border-black',
          defaults.masterMindColors[colorIndex],
        )}
      ></button>
    </>
  );
}
