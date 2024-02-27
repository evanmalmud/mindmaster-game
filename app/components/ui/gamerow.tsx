import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils';
import { Button } from './button';
import { array } from 'zod';
import { aC } from 'vitest/dist/reporters-rzC174PQ';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import * as defaults from '../../lib/constants';
import { action, loader } from '~/routes/game';

// Create game state for buttons inputs
// The index of the color for each button

function GameRow({
  activeRow,
  isActive,
  index,
}: {
  activeRow: number;
  isActive: boolean;
  index: number;
}) {
  if (isActive) {
    console.log('ROW ACTIVE' + index + ' IS ACTIVE');
  }
  var isShowColors = index <= activeRow;

  const numberOfButtons = 4;
  const gameButtons = [];
  for (let i = 0; i < numberOfButtons; i++) {
    gameButtons.push({ index: i, isActive: index === activeRow });
  }
  return (
    <Form method="post" className={cn('flex min-w-full flex-row gap-2')}>
      <input type="hidden" name={'ActiveRow'} value={activeRow}></input>
      {gameButtons.map((row) => (
        <GameButton
          index={row.index}
          isShowColors={isShowColors}
          isActive={row.isActive}
        />
      ))}
      <GameResults index={index} activeRow={activeRow} isActive={isActive} />
    </Form>
  );
}

function GameButton({
  index,
  isActive,
  isShowColors,
}: {
  index: number;
  isActive: boolean;
  isShowColors: boolean;
}) {
  const [buttonState, setButtonState] = React.useState(0);

  const onClick = () => {
    if (!isActive) {
      return;
    }
    if (buttonState + 1 >= defaults.masterMindColors.length) {
      setButtonState(0);
    } else {
      setButtonState(buttonState + 1);
    }
  };

  const disabledButtonClass = 'cursor-not-allowed';
  var className = '';

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

function GameResults({
  index,
  activeRow,
  isActive,
  onSubmit,
}: {
  index: number;
  activeRow: number;
  isActive: boolean;
  onSubmit?(): void;
}) {
  const { code } = useLoaderData<typeof loader>();

  let submissionData = useActionData<typeof action>();
  let correctColorAndSpot: number = 0;
  let correctColor: number = 0;
  if (
    submissionData?.activeRowSubmission != undefined &&
    submissionData.activeRowSubmission == index
  ) {
    if (submissionData?.gameButtonSubmission != undefined) {
      //Calc results
      let temp: number[] = Object.assign([], code);
      for (let i = 0; i < submissionData?.gameButtonSubmission.length; i++) {
        if (temp.indexOf(submissionData?.gameButtonSubmission[i]) > -1) {
          temp.splice(temp.indexOf(submissionData?.gameButtonSubmission[i]), 1);
          correctColor++;
        }
      }

      for (let i = 0; i < submissionData?.gameButtonSubmission.length; i++) {
        if (code[i] == submissionData?.gameButtonSubmission[i]) {
          correctColorAndSpot++;
        }
      }
      correctColor = correctColor - correctColorAndSpot;
    }
  }

  // Create Results
  const gameResults = [];
  for (let i = 0; i < correctColorAndSpot; i++) {
    gameResults.push({ correctColorAndSpot: true });
  }
  for (let i = 0; i < correctColor; i++) {
    gameResults.push({ correctColor: true });
  }
  for (let i = gameResults.length; i < 4; i++) {
    gameResults.push({});
  }

  console.log(gameResults);

  if (isActive) {
    return (
      <div className={cn('ml-auto grid content-center justify-center gap-1')}>
        <GameSubmitButton onSubmit={onSubmit} />
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
  var className = '';
  if (correctColorAndSpot) {
    console.log('Correct');
    className = 'bg-green';
  } else if (correctColor) {
    className = 'bg-red';
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

function GameSubmitButton({
  className,
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <div>
      <button
        type="submit"
        className={cn(
          'rounded-full border border-solid border-black bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700',
          className,
        )}
      >
        Submit
      </button>
    </div>
  );
}

export { GameRow };
