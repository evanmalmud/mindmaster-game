import { motion } from 'framer-motion';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { authenticator } from '~/services/auth.server';
import { getUniqueCode } from '~/lib/code';
import { GameRow } from '~/components/ui/gamerow';
import React from 'react';

export function loader() {
  const code = getUniqueCode();

  return json({ code });
}

const numberOfGuessesAllowed = 5;

export default function GameScreen() {
  const { code } = useLoaderData<typeof loader>();

  const [activeRow, setActiveRowState] = React.useState(0);

  const onSubmit = () => {
    if (activeRow + 1 >= numberOfGuessesAllowed) {
      //TODO: END/LOSS STATE
    } else {
      setActiveRowState(activeRow + 1);
    }
  };

  const gameRows = [];
  for (let i = 0; i < numberOfGuessesAllowed; i++) {
    gameRows.push(
      <GameRow
        key={i}
        isActive={i == activeRow}
        onSubmit={onSubmit}
        className={'flex min-w-full flex-row'}
      />,
    );
  }

  return (
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

        <div>{code.toString()}</div>

        <Card
          className={`box-border flex min-h-96 min-w-full flex-col gap-2 rounded border-solid border-black bg-white p-2`}
        >
          {gameRows}
        </Card>
      </div>
    </main>
  );
}
