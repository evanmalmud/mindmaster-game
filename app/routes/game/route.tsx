import { Link, type ShouldRevalidateFunctionArgs } from '@remix-run/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';

import { Card } from '~/components/ui/card';
import { Toaster } from '~/components/ui/toaster';
import { useToast } from '~/components/ui/use-toast';
import { masterMindColors } from '~/lib/constants';
import { GameRow } from '~/routes/game/gamerow';
import { cn } from '~/utils';

import {
  action,
  loader,
  useGameRouteAction,
  useGameState,
} from './route.handlers';

export { loader, action };

/**
 * Avoid revalidating and running our loader function on actions in this route.
 * This ensures we only create 1 code when the user first visits the route.
 */
export function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult) {
    return false;
  }

  return defaultShouldRevalidate;
}

export default function Game() {
  const gameState = useGameState();
  const { toast } = useToast();
  const actionData = useGameRouteAction();

  // Toast for actions that return an error (mostly for dev purposes)
  useEffect(() => {
    if (actionData && !actionData?.ok) {
      toast({
        title: 'UH OH',
        description: 'Seems like a couple screws got loose',
      });
    }
  }, [actionData, toast]);

  return (
    <>
      <header className="border-b border-neutral-400">
        <div className="container px-4 py-2">
          <Link to="/">
            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: -700 }}
              transition={{ type: 'spring', stiffness: 35, duration: 0.3 }}
              className="font-display text-lg uppercase lg:text-2xl"
            >
              Mastermind
            </motion.h1>
          </Link>
        </div>
      </header>

      <main className="flex min-h-dvh flex-col items-center justify-center">
        <div className="container px-4">
          <Card className="mx-auto flex min-h-96 max-w-[400px] flex-col gap-2 rounded border-solid border-neutral-600 p-2 lg:max-w-lg">
            {gameState.game.submissions.map((_, i) => (
              <GameRow key={i} index={i} />
            ))}
          </Card>
        </div>

        <WinLossFooter />
      </main>
      <Toaster />
    </>
  );
}

export function WinLossFooter() {
  const gameState = useGameState();
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
  if (gameState.game.isWinner) {
    footerString = 'WINNER';
  }
  if (gameState.isGameOver) {
    for (let i = 0; i < 4; i++) {
      gameButtons[i].colorIndex = gameState.game.code.code[i];
    }
    controls.start('visible');
  }

  function refreshPage() {
    window.parent.location = window.parent.location.href;
  }

  return (
    <motion.div
      variants={wrapperVariants}
      animate={controls}
      initial="hidden"
      transition={{ type: 'spring', stiffness: 35, duration: 0.3 }}
    >
      <div className={cn('flex flex-col justify-center gap-2')}>
        <div className="flex flex-row justify-center gap-6">
          <h1 className="text-center font-display text-6xl uppercase">
            {footerString}
          </h1>
          <button type="button" onClick={refreshPage}>
            <h1 className="text-center font-display text-5xl uppercase">
              Retry?
            </h1>
          </button>
        </div>
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
          masterMindColors[colorIndex],
        )}
      ></button>
    </>
  );
}
