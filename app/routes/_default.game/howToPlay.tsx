import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

import { GameResultDot, GameResults } from './gamerow';

export function HowToPlay() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            <h1 className="text-lg font-bold">How To Play</h1>
          </DialogTitle>
          <DialogDescription>
            <div>
              <h2 className="text-base font-semibold">
                Guess the sequence in 6 tries or less to win the game.{' '}
              </h2>
              <h2 className="text-base font-semibold">
                The result grid order does NOT correspond to the order of your
                guess{' '}
              </h2>
            </div>
            <br></br>
            <div className="flex min-w-full flex-row gap-2">
              <GameResultDot
                index={0}
                type={'correctColorAndSpot'}
              ></GameResultDot>
              <div>
                <h3 className="text-base font-semibold">
                  {' '}
                  A green circle means you have the correct color and spot.
                </h3>
              </div>
            </div>
            <br></br>
            <div className="flex min-w-full flex-row gap-2">
              <GameResultDot index={0} type={'correctColor'}></GameResultDot>
              <div>
                <h3 className="text-base font-semibold">
                  {' '}
                  A yellow circle means you have the correct color but the wrong
                  spot.
                </h3>
              </div>
            </div>
            <br></br>
            <div className="flex min-w-full flex-row gap-2">
              <GameResultDot index={0} type={'incorrect'}></GameResultDot>
              <div>
                <h3 className="text-base font-semibold">
                  {' '}
                  A gray circle means you have the wrong color.
                </h3>
              </div>
            </div>
            <br></br>
            <div className="flex min-w-full flex-row gap-2">
              <GameResultDot index={0} type={'idle'}></GameResultDot>
              <div>
                <h3 className="text-base font-semibold">
                  {' '}
                  A white circle means you haven&apos;t guessed yet!
                </h3>
              </div>
            </div>
            <div className="flex min-w-full flex-row gap-2">
              <GameResults result={[0, 1, -1, 2]} />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
