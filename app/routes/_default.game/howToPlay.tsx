import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

import { GameResultDot } from './gamerow';

export function HowToPlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl uppercase">
            How To Play
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 pt-2">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Guess the 4-color sequence in <strong className="text-foreground">6 tries</strong> or less.
            Tap each circle to cycle through colors, then submit your guess.
          </p>

          <div className="rounded-lg border border-neutral-600 bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
              Result Dots
            </h3>

            <div className="flex flex-col gap-3">
              <ResultExplanation type="correctColorAndSpot">
                Correct color <em>and</em> position
              </ResultExplanation>
              <ResultExplanation type="correctColor">
                Correct color, wrong position
              </ResultExplanation>
              <ResultExplanation type="incorrect">
                Color not in the code
              </ResultExplanation>
            </div>
          </div>

          <div className="rounded-lg border border-code-yellow/40 bg-code-yellow/10 p-4">
            <p className="text-sm leading-relaxed">
              <strong className="text-foreground">Important:</strong>{' '}
              <span className="text-foreground/80">
                The result dots are sorted — greens first, then yellows, then
                grays. They do <strong>not</strong> match the position of your
                guess.
              </span>
            </p>
          </div>

          <div className="rounded-lg border border-neutral-600 bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide">
              Daily Puzzle
            </h3>
            <p className="text-sm text-muted-foreground">
              A new puzzle is available every day at 2:00 AM EST. Everyone gets
              the same puzzle — compare your results with friends!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResultExplanation({
  type,
  children,
}: {
  type: 'correctColorAndSpot' | 'correctColor' | 'incorrect';
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        <GameResultDot index={0} type={type} />
      </div>
      <span className="text-sm">{children}</span>
    </div>
  );
}
