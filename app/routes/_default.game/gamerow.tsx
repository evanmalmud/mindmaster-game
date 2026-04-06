import { motion } from 'framer-motion';
import { useState } from 'react';
import type { ComponentProps } from 'react';

import { colorblindSymbols, masterMindColors } from '~/lib/constants';
import { useTheme } from '~/lib/theme';
import { cn } from '~/utils';

import { useGameState } from './route.handlers';

const MOTION_DELAY_SECONDS = 0.15;
const MOTION_DELAY = [...Array(5)].map((_, i) => i * MOTION_DELAY_SECONDS);

export function GameRow({ index }: { index: number }) {
  const gameState = useGameState();
  const submission = gameState.game.submissions[index];
  const isActiveRow = index === gameState.activeRow;
  const hasResult = submission.result.length > 0;

  return (
    <div className="flex min-w-full flex-row items-center gap-1.5 sm:gap-2">
      <input type="hidden" name="id" value={gameState.game.id} />
      <div className="flex flex-1 flex-row justify-center gap-1.5 sm:gap-2">
        {submission.code.map((value: number, i: number) => (
          <GameButton
            key={i}
            index={i}
            initialValue={value}
            isActive={isActiveRow}
          />
        ))}
      </div>

      {/* Only show result dots for submitted rows */}
      {hasResult ? (
        <GameResults result={submission.result} />
      ) : (
        <div className="w-[52px] shrink-0 sm:w-[60px] lg:w-[76px]" />
      )}
    </div>
  );
}

export function GameSubmitButton({ elapsed }: { elapsed: number }) {
  return (
    <>
      <input type="hidden" name="elapsed" value={elapsed} />
      <BaseButton
        type="submit"
        className="bg-blue-500 px-8 py-2.5 font-bold text-white"
      >
        Submit
      </BaseButton>
    </>
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
  const { colorblind } = useTheme();

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
          'size-16 select-none sm:size-[72px] lg:size-24',
          masterMindColors[buttonState],
          {
            'cursor-not-allowed opacity-50': !isActive,
          },
        )}
      >
        {colorblind ? (
          <span className="text-xl font-bold text-neutral-900 sm:text-2xl lg:text-3xl">
            {colorblindSymbols[buttonState]}
          </span>
        ) : (
          <span className="sr-only">{masterMindColors[buttonState]}</span>
        )}
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

const resultSymbol: Record<ResultType, string> = {
  incorrect: '✕',
  correctColor: '~',
  correctColorAndSpot: '✓',
  idle: '',
};

export function GameResults({ result }: { result: number[] }) {
  return (
    <div className="grid w-[52px] shrink-0 grid-cols-2 content-center justify-center gap-1 sm:w-[60px] lg:w-[76px]">
      {result.map((value, i) => (
        <GameResultDot
          key={i}
          index={i}
          type={
            // @ts-expect-error toString produces any which is fine because we have a fallback
            resultType[value.toString()] ?? resultType[2]
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
  const { colorblind } = useTheme();

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
            'absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full border border-neutral-700 bg-black',
            {
              'bg-code-gray': type === 'incorrect',
              'bg-code-yellow': type === 'correctColor',
              'bg-code-green': type === 'correctColorAndSpot',
              'bg-neutral-50': type === 'idle',
            },
          )}
        >
          {colorblind && type !== 'idle' && (
            <span className="text-[10px] font-bold text-white lg:text-xs">
              {resultSymbol[type]}
            </span>
          )}
        </motion.div>
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
