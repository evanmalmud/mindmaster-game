import { Form } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { masterMindColors } from '~/lib/constants';
import { cn } from '~/utils';

import { useGameState } from './route.handlers';

// Create game state for buttons inputs
// The index of the color for each button

export function GameRow({ index }: { index: number }) {
  const gameState = useGameState();
  const submission = gameState.game.submissions[index];
  const isActiveRow = index === gameState.activeRow;

  return (
    <Form method="post" className={cn('flex min-w-full flex-row gap-2')}>
      <input type="hidden" name="id" value={gameState.game.id} />
      {submission.code.map((value, i) => (
        <GameButton key={i} initialValue={value} isActive={isActiveRow} />
      ))}

      {isActiveRow ? (
        <GameSubmitButton />
      ) : (
        <GameResults result={submission.result} />
      )}
    </Form>
  );
}

function GameButton({
  initialValue,
  isActive,
}: {
  initialValue: number;
  isActive: boolean;
}) {
  const [buttonState, setButtonState] = useState(initialValue);

  function onClick() {
    if (!isActive) {
      return;
    }
    if (buttonState + 1 >= masterMindColors.length) {
      setButtonState(0);
    } else {
      setButtonState(buttonState + 1);
    }
  }

  return (
    <>
      <input type="hidden" name="answer" value={buttonState} />
      <motion.button
        disabled={!isActive}
        onClick={onClick}
        type="button"
        whileTap={{ scale: 0.9 }}
        className={cn(
          'size-14 rounded-full border border-solid border-black lg:size-24',
          masterMindColors[buttonState],
          // disabled button styles
          {
            'cursor-not-allowed': !isActive,
          },
        )}
      >
        <span className="sr-only">{masterMindColors[buttonState]}</span>
      </motion.button>
    </>
  );
}

function GameResults({ result }: { result: number[] }) {
  return (
    <div className="ml-auto grid grid-cols-2 content-center justify-center gap-1 px-2">
      {result.map((value, i) => (
        <GameResultDot
          key={i}
          correctColor={value === 0}
          correctColorAndSpot={value === 1}
        />
      ))}
    </div>
  );
}

function GameResultDot({
  correctColor,
  correctColorAndSpot,
}: {
  correctColor?: boolean;
  correctColorAndSpot?: boolean;
}) {
  return (
    <div>
      <div
        className={cn(
          'size-6 rounded-full border border-solid border-black lg:size-8',
          {
            'bg-ctp-green': correctColorAndSpot,
            'bg-ctp-red': correctColor,
          },
        )}
      >
        <span className="sr-only">
          {correctColorAndSpot
            ? 'Correct color and spot'
            : correctColor
              ? 'Correct color'
              : 'Wrong wrong wrong'}
        </span>
      </div>
    </div>
  );
}

function GameSubmitButton() {
  return (
    <div className="ml-auto grid content-center justify-center gap-1">
      <motion.button
        type="submit"
        whileTap={{ scale: 0.9 }}
        className="rounded-full border border-solid border-black bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Submit
      </motion.button>
    </div>
  );
}
