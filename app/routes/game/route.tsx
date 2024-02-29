import type { ShouldRevalidateFunctionArgs } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

import { Card } from '~/components/ui/card';
import { Toaster } from '~/components/ui/toaster';
import { useToast } from '~/components/ui/use-toast';
import { GameRow } from '~/routes/game/gamerow';

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
      <main className="flex min-h-dvh flex-col items-center justify-center">
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
            {gameState.game.submissions.map((_, i) => (
              <GameRow key={i} index={i} />
            ))}
          </Card>
        </div>
      </main>
      <Toaster />
    </>
  );
}
