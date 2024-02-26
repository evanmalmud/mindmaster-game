import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils';
import { Button } from './button';
import { array } from 'zod';

// Create game state for buttons inputs
// The index of the color for each button

const masterMindColors = [
  'bg-ctp-red',
  'bg-ctp-blue',
  'bg-ctp-peach',
  'bg-ctp-yellow',
  'bg-ctp-green',
];

function GameRow({
  activeRow,
  isActive,
  index,
  onSubmit,
}: {
  activeRow: number;
  isActive: boolean;
  index: number;
  onSubmit?(): void;
}) {
  if (isActive) {
    console.log('ROW ACTIVE' + index + ' IS ACTIVE');
  }
  return (
    <div className={cn('flex min-w-full flex-row gap-2')}>
      <GameButton isActive={isActive} />
      <GameButton isActive={isActive} />
      <GameButton isActive={isActive} />
      <GameButton isActive={isActive} />
      <GameResults isActive={isActive} onSubmit={onSubmit} />
    </div>
  );
}

function GameButton({ isActive }: { isActive: boolean }) {
  const [buttonState, setButtonState] = React.useState(0);

  const onClick = () => {
    if (!isActive) {
      return;
    }
    if (buttonState + 1 >= masterMindColors.length) {
      setButtonState(0);
    } else {
      setButtonState(buttonState + 1);
    }
  };

  const disabledButtonClass = 'cursor-not-allowed';
  var className = '';

  if (!isActive) {
    className = cn(className, disabledButtonClass);
  } else {
    className = cn(className, masterMindColors[buttonState]);
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        'size-24 rounded-full border border-solid border-black',
        className,
      )}
    ></button>
  );
}

function GameResults({
  isActive,
  onSubmit,
}: {
  isActive: boolean;
  onSubmit?(): void;
}) {
  if (isActive) {
    return (
      <div
        className={cn('ml-auto grid content-center justify-center gap-1 px-2')}
      >
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
      <GameResultButton />
      <GameResultButton />
      <GameResultButton />
      <GameResultButton />
    </div>
  );
}

function GameResultButton({
  className,
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <div>
      <button
        className={cn(
          'size-8 rounded-full border border-solid border-black bg-white',
          className,
        )}
      ></button>
    </div>
  );
}

function GameSubmitButton({
  className,
  onSubmit,
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <div>
      <button
        className={cn(
          'rounded-full border border-solid border-black bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700',
          className,
        )}
        onClick={onSubmit}
      >
        Submit
      </button>
    </div>
  );
}

export { GameRow };
