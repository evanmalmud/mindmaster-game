import { Form, useActionData, useLoaderData } from '@remix-run/react';
import * as React from 'react';

import { action, loader } from '~/routes/game';
import { cn } from '~/utils';

import * as defaults from '../../lib/constants';

// Create game state for buttons inputs
// The index of the color for each button

function GameRow({ isActive, index }: { isActive: boolean; index: number }) {
  const gameLoaderState = useLoaderData<typeof loader>();
  let gameState = useActionData<typeof action>();
  if (gameState == undefined) {
    gameState = gameLoaderState;
  }

  if (isActive) {
    console.log('ROW ACTIVE' + index + ' IS ACTIVE');
  }
  const isShowColors = index <= gameState.activeRow;

  const numberOfButtons = 4;
  const gameButtons = [];
  for (let i = 0; i < numberOfButtons; i++) {
    gameButtons.push({ index: i, isActive: index === gameState.activeRow });
  }
  return (
    <Form method="post" className={cn('flex min-w-full flex-row gap-2')}>
      <input
        type="hidden"
        name={'GameState'}
        value={JSON.stringify(gameState)}
      ></input>
      <input
        type="hidden"
        name={'ActiveRow'}
        value={gameState.activeRow}
      ></input>
      {gameButtons.map((row) => (
        <GameButton
          key={row.index}
          index={row.index}
          isShowColors={isShowColors}
          isActive={row.isActive}
        />
      ))}
      <GameResults index={index} />
    </Form>
  );
}

function GameButton({
  isActive,
  isShowColors,
}: {
  index?: number;
  isActive: boolean;
  isShowColors: boolean;
}) {
  const [buttonState, setButtonState] = React.useState(0);

  function onClick() {
    if (!isActive) {
      return;
    }
    if (buttonState + 1 >= defaults.masterMindColors.length) {
      setButtonState(0);
    } else {
      setButtonState(buttonState + 1);
    }
  }

  const disabledButtonClass = 'cursor-not-allowed';
  let className = '';

  if (!isActive) {
    className = cn(className, disabledButtonClass);
  }
  if (isShowColors) {
    className = cn(className, defaults.masterMindColors[buttonState]);
  }
  return (
    <>
      <input type="hidden" name={'GameButton'} value={buttonState}></input>
      <button
        onClick={onClick}
        type="button"
        className={cn(
          'size-24 rounded-full border border-solid border-black',
          className,
        )}
      ></button>
    </>
  );
}

function GameResults({ index }: { index: number }) {
  const gameLoaderState = useLoaderData<typeof loader>();
  let gameState = useActionData<typeof action>();
  if (gameState == undefined) {
    gameState = gameLoaderState;
  }
  // Create Results
  const gameResults = [];
  for (let i = 0; i < 4; i++) {
    if (i < gameState.results[index]?.correctColorAndSpot) {
      gameResults.push({ key: i, correctColorAndSpot: true });
    } else if (
      i <
      gameState.results[index]?.correctColorAndSpot +
        gameState.results[index]?.correctColor
    ) {
      gameResults.push({ key: i, correctColor: true });
    } else {
      gameResults.push({ key: i });
    }
  }
  console.log('Game results index: ' + index);
  console.log(gameResults);
  console.log(gameState);

  if (gameState.activeRow == index) {
    return (
      <div className={cn('ml-auto grid content-center justify-center gap-1')}>
        <GameSubmitButton />
      </div>
    );
  }
  return (
    <div
      className={cn(
        'ml-auto grid grid-cols-2 content-center justify-center gap-1 px-2',
      )}
    >
      {gameResults.map((row) => (
        <GameResultButton
          key={row.key}
          correctColor={row.correctColor}
          correctColorAndSpot={row.correctColorAndSpot}
        />
      ))}
    </div>
  );
}

function GameResultButton({
  correctColor,
  correctColorAndSpot,
}: {
  correctColor?: boolean;
  correctColorAndSpot?: boolean;
}) {
  let className = '';
  if (correctColorAndSpot) {
    console.log('Correct');
    className = 'bg-ctp-green';
  } else if (correctColor) {
    className = 'bg-ctp-red';
  }
  return (
    <div>
      <button
        type="button"
        className={cn(
          'size-8 rounded-full border border-solid border-black',
          className,
        )}
      ></button>
    </div>
  );
}

function GameSubmitButton() {
  return (
    <div>
      <button
        type="submit"
        className={cn(
          'rounded-full border border-solid border-black bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700',
        )}
      >
        Submit
      </button>
    </div>
  );
}

export { GameRow };
