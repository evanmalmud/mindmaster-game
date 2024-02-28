/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form } from '@remix-run/react';
import * as React from 'react';

import { useloadGameState } from '~/routes/game';
import { cn } from '~/utils';

import * as defaults from '../../lib/constants';

import { GameResults } from './gameresults';

// Create game state for buttons inputs
// The index of the color for each button

export function GameRow({ index }: { isActive: boolean; index: number }) {
  const gameState = useloadGameState();

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
          rowIndex={index}
          isShowColors={isShowColors}
          isActive={row.isActive}
        />
      ))}
      <GameResults index={index} />
    </Form>
  );
}

type ButtonState = {
  initialColorIndex: number;
  buttonColorIndex: number;
  isClicked: boolean;
};

export function GameButton({
  index,
  rowIndex,
  isActive,
  isShowColors,
}: {
  index: number;
  rowIndex: number;
  isActive: boolean;
  isShowColors: boolean;
}) {
  const gameState = useloadGameState();

  //TODO: How to type this as ButtonState
  const [buttonState, setButtonState] = React.useState({
    initialColorIndex: 0,
    buttonColorIndex: 0,
    isInitialized: false,
  });

  function onClick() {
    if (!isActive || gameState.gameOver) {
      return;
    }
    let newIndex = {};
    if (buttonState.buttonColorIndex + 1 >= defaults.masterMindColors.length) {
      newIndex = { buttonColorIndex: 0 };
    } else {
      newIndex = { buttonColorIndex: buttonState.buttonColorIndex + 1 };
    }

    setButtonState((buttonState) => ({
      ...buttonState,
      ...newIndex,
    }));
  }

  //Set initial button state if not clicked
  if (
    isActive &&
    !buttonState.isInitialized &&
    rowIndex > 0 &&
    rowIndex >= gameState.activeRow
  ) {
    const isInitialized = { isInitialized: true };
    const buttonIndex = {
      initialColorIndex: gameState.submissions[rowIndex - 1][index],
      buttonColorIndex: gameState.submissions[rowIndex - 1][index],
    };
    setButtonState((buttonState) => ({
      ...buttonState,
      ...buttonIndex,
      ...isInitialized,
    }));
  }

  const disabledButtonClass = 'cursor-not-allowed';
  let className = '';

  if (!isActive || gameState.gameOver) {
    className = cn(className, disabledButtonClass);
  }

  if (isShowColors) {
    className = cn(
      className,
      defaults.masterMindColors[buttonState.buttonColorIndex],
    );
  }

  return (
    <>
      <input
        type="hidden"
        name={'GameButton'}
        value={buttonState.buttonColorIndex}
      ></input>
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
