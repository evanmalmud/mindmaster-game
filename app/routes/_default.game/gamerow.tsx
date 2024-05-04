import { motion } from 'framer-motion';
import { useState } from 'react';
import type { ComponentProps } from 'react';

import { masterMindColors } from '~/lib/constants';
import { cn } from '~/utils';

import { useGameState } from './route.handlers';

const MOTION_DELAY_SECONDS = 0.15;
const MOTION_DELAY = [...Array(5)].map((_, i) => i * MOTION_DELAY_SECONDS);

export function GameRow({ index }: { index: number }) {
  const gameState = useGameState();
  const submission = gameState.game.submissions[index];
  const isActiveRow = index === gameState.activeRow;

  return (
    <div className="flex min-w-full flex-row gap-2">
      <input type="hidden" name="id" value={gameState.game.id} />
      {submission.code.map((value: number, i: number) => (
        <GameButton
          key={i}
          index={i}
          initialValue={value}
          isActive={isActiveRow}
        />
      ))}

      <GameResults result={submission.result} />
    </div>
  );
}

export function GameSubmitButton() {
  return (
    <BaseButton
      type="submit"
      className="bg-blue-500 px-8 py-2 font-bold text-white"
    >
      Submit
    </BaseButton>
  );
}

function GameButton({
  index,
  initialValue,
  isActive,
}: {
  index: number;
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
      {isActive ? (
        <input type="hidden" name="answer" value={buttonState} />
      ) : null}

      <BaseButton
        disabled={!isActive}
        onClick={onClick}
        type="button"
        transition={{
          delay: MOTION_DELAY[index],
        }}
        className={cn(
          'size-14 select-none sm:size-16 lg:size-24',
          masterMindColors[buttonState],
          {
            // disabled button styles
            'cursor-not-allowed opacity-50': !isActive,
          },
        )}
      >
        <span className="sr-only">{masterMindColors[buttonState]}</span>
      </BaseButton>
    </>
  );
}

const resultType = {
  '-1': 'incorrect',
  '0': 'correctColor',
  '1': 'correctColorAndSpot',
  '2': 'idle',
} as const;

type ResultType = (typeof resultType)[keyof typeof resultType];

const resultText: Record<ResultType, string> = {
  incorrect: 'Wrong wrong wrong',
  correctColor: 'Correct color',
  correctColorAndSpot: 'Correct color and spot',
  idle: '',
};

export function GameResults({ result }: { result: number[] }) {
  return (
    <div className="ml-auto grid grid-cols-2 content-center justify-center gap-1 px-2">
      {(result.length ? result : [...Array(4)]).map((value, i) => (
        <GameResultDot
          key={i}
          index={i}
          type={
            typeof value !== 'undefined'
              ? // @ts-expect-error toString produces any which is fine because we have a fallback
                resultType[value.toString()]
              : resultType[2]
          }
        />
      ))}
    </div>
  );
}

export function GameResultDot({
  index,
  type,
}: {
  index: number;
  type: ResultType;
}) {
  return (
    <div>
      <motion.div
        animate={{ scale: 1 }}
        initial={{ scale: 0 }}
        transition={{ delay: 0.6 + index * 0.1 }}
        className="relative size-6 rounded-full border-2 border-neutral-700 bg-black will-change-transform lg:size-8"
      >
        <motion.div
          animate={{ y: type === 'idle' ? -1 : -3 }}
          initial={{ y: -1 }}
          transition={{
            delay: index * 0.1,
          }}
          className={cn(
            'absolute left-0 top-0 h-full w-full rounded-full border border-neutral-700 bg-black',
            {
              'bg-code-gray': type === 'incorrect',
              'bg-code-yellow': type === 'correctColor',
              'bg-code-green': type === 'correctColorAndSpot',
              'bg-neutral-50': type === 'idle',
            },
          )}
        />
        <span className="sr-only">{resultText[type]}</span>
      </motion.div>
    </div>
  );
}

function BaseButton({
  children,
  className,
  transition,
  ...props
}: ComponentProps<typeof motion.button>) {
  const [isAnimating, setIsAnimating] = useState(true);

  return (
    <motion.button
      {...props}
      // Framer.animation props
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        ...transition,
        type: 'spring',
        bounce: 0.25,
      }}
      onAnimationComplete={() => setIsAnimating(false)}
      className={cn(
        'font-matter group rounded-full border-2 border-neutral-700 shadow-input-idle will-change-transform',
        className,
        {
          // can only apply the transition styles needed for clicking the
          // button after framer is done animating them in. otherwise they
          // conflict with the animation styles framer is trying to set.
          'transition-all duration-150 ease-in-out active:translate-y-[2px] active:shadow-input-shrink active:duration-100 md:hover:translate-y-[-2px] md:hover:shadow-input-grow md:active:shadow-input-shrink md:active:duration-100':
            !props.disabled && !isAnimating,
          'cursor-not-allowed': props.disabled,
        },
      )}
    >
      {children}
    </motion.button>
  );
}
