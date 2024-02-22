import { motion } from 'framer-motion';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { authenticator } from '~/services/auth.server';
import { getUniqueCode } from '~/lib/code';
import { GameRow } from '~/components/ui/gamerow';

export function loader() {
  const code = getUniqueCode();

  return json({ code });
}

export default function GameScreen() {
  const { code } = useLoaderData<typeof loader>();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center">
        <motion.h1
          animate={{ opacity: 1, y: -200 }}
          initial={{ opacity: 0, y: -700 }}
          transition={{ duration: 0.5 }}
          className="font-display text-6xl uppercase"
        >
          Mastermind
        </motion.h1>

        <div>{code.toString()}</div>

        <Card
          className={`box-border flex min-h-96 min-w-full flex-col rounded border-solid border-black bg-white`}
        >
          <GameRow className={'flex-1 flex flex-row min-w-full'}>

          </GameRow>
          <GameRow className={'flex-1 flex flex-row min-w-full'}>

          </GameRow>
          <GameRow className={'flex-1 flex flex-row min-w-full'}>

          </GameRow>
          <GameRow className={'flex-1 flex flex-row min-w-full'}>

          </GameRow>
          <GameRow className={'flex-1 flex flex-row min-w-full'}>

          </GameRow>
        </Card>
      </div>
    </main>
  );
}
