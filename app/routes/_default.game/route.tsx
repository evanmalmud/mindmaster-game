import type { ShouldRevalidateFunctionArgs } from '@remix-run/react';
import { Form, Link, useLocation } from '@remix-run/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

import { Toaster } from '~/components/ui/toaster';
import { useToast } from '~/components/ui/use-toast';
import { masterMindColors } from '~/lib/constants';
import { GameRow, GameSubmitButton } from '~/routes/_default.game/gamerow';
import { cn } from '~/utils';

import { HowToPlay } from './howToPlay';
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

  const { state } = useLocation();

  console.log(state);

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
      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 border-b border-neutral-400">
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

        <main className="mt-10 flex flex-auto flex-col md:mt-0 md:items-center md:justify-center">
          {state?.howToPlay ? <HowToPlay /> : null}
          <Form method="post" className="flex flex-col items-center gap-y-8">
            <div className="container px-4">
              <motion.div
                animate={{ scale: gameState.isGameOver ? 0.7 : 1 }}
                className="mx-auto flex h-[362px] max-w-[400px] flex-col gap-y-4 rounded-xl border border-solid border-neutral-600 bg-card p-2 text-card-foreground shadow sm:h-[402px] lg:h-[562px] lg:max-w-lg"
              >
                <AnimatePresence>
                  {gameState.game.submissions.map((_, i) => (
                    <GameRow key={i} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {!gameState.isGameOver ? <GameSubmitButton /> : null}
          </Form>

          {gameState.isGameOver ? <WinLossFooter /> : null}
        </main>
      </div>

      <Toaster />
    </>
  );
}

export function WinLossFooter() {
  const gameState = useGameState();

  const decision = gameState.game.isWinner ? 'winner' : 'loss';

  function refreshPage() {
    window.parent.location = window.parent.location.href;
  }

  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
      }}
      initial={{
        opacity: 0,
        y: 300,
      }}
      transition={{ type: 'spring', stiffness: 35, duration: 0.3 }}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-row justify-center gap-6">
          <h1 className="text-center font-display text-6xl uppercase">
            {decision}
          </h1>
          <button type="button" onClick={refreshPage}>
            <h1 className="text-center font-display text-5xl uppercase">
              Retry?
            </h1>
          </button>
        </div>
        <div className="flex flex-row gap-2">
          {gameState.game.code.code.map((codeColor, i) => (
            <WinLossAnswer key={i} colorIndex={codeColor} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function WinLossAnswer({ colorIndex }: { colorIndex: number }) {
  return (
    <>
      <div
        className={cn(
          'size-14 select-none rounded-full border border-solid border-black sm:size-16 lg:size-24',
          masterMindColors[colorIndex],
        )}
      />
    </>
  );
}
