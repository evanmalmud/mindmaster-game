import type { ShouldRevalidateFunctionArgs } from '@remix-run/react';
import { Form, Link } from '@remix-run/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Key, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Confetti } from '~/components/confetti';
import { Toaster } from '~/components/ui/toaster';
import { useToast } from '~/components/ui/use-toast';
import { colorblindSymbols, masterMindColors } from '~/lib/constants';
import { generateShareImage, shareResult } from '~/lib/share';
import { useTheme } from '~/lib/theme';
import { GameRow, GameSubmitButton } from '~/routes/_default.game/gamerow';
import { cn } from '~/utils';

import { HowToPlay } from './howToPlay';
import {
  action,
  loader,
  useGameRouteAction,
  useGameRouteLoader,
  useGameState,
} from './route.handlers';

export { loader, action };

export function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult) {
    return false;
  }

  return defaultShouldRevalidate;
}

// Mild scale-down on game over so vertical movement stays small and stable
// across viewport widths. Margin-bottom is calculated at runtime to cancel
// the layout space that the transform doesn't reclaim.
const BOARD_END_SCALE = 0.85;
const BOARD_END_GAP_PX = 24;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function useTimer(isGameOver: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameOver]);

  return elapsed;
}

export default function Game() {
  const gameState = useGameState();
  const loaderData = useGameRouteLoader();
  const { toast } = useToast();
  const actionData = useGameRouteAction();
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const elapsed = useTimer(gameState.isGameOver);

  const mainRef = useRef<HTMLElement>(null);
  const boardWrapRef = useRef<HTMLDivElement>(null);
  const [{ boardScale, boardCollapsePx }, setBoardFit] = useState({
    boardScale: 1,
    boardCollapsePx: 0,
  });

  // Scale the board to fit the viewport and compensate for the CSS transform
  // not affecting layout. When the game ends we also apply BOARD_END_SCALE as
  // a ceiling. Re-runs on game state changes and window resize.
  useLayoutEffect(() => {
    const compute = () => {
      const main = mainRef.current;
      const board = boardWrapRef.current;
      if (!main || !board) return;

      const endScale = gameState.isGameOver ? BOARD_END_SCALE : 1;
      const endGap = gameState.isGameOver ? BOARD_END_GAP_PX : 0;

      // offsetHeight is pre-transform and reflects the unscaled layout height.
      // Sum only the non-board siblings of main; don't use (mainNatural -
      // boardNatural) because `form`'s layout height already includes the
      // marginBottom we applied on the previous pass, which would make the
      // scale self-reinforcing instead of converging.
      const boardNatural = board.offsetHeight;
      const nonBoardNatural = [...main.children].reduce((sum, el) => {
        const h = (el as HTMLElement).offsetHeight;
        return el.contains(board) ? sum : sum + h;
      }, 0);
      // Reserve endGap so the scaled board doesn't end flush against the
      // end-game footer (LOSS/WINNER heading). Reserving here means the fit
      // scale shrinks a touch more on tight viewports instead of introducing
      // overflow.
      const available = main.clientHeight - nonBoardNatural - endGap;

      const fitScale = boardNatural > 0 ? available / boardNatural : 1;
      const scale = Math.min(endScale, fitScale, 1);
      setBoardFit({
        boardScale: scale,
        boardCollapsePx: -boardNatural * (1 - scale) + endGap,
      });
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [gameState.isGameOver, gameState.game.submissions.length]);

  useEffect(() => {
    if (actionData && !actionData?.ok) {
      toast({
        title: 'UH OH',
        description: 'Seems like a couple screws got loose',
      });
    }
  }, [actionData, toast]);

  const solveTime = actionData?.solveTimeSeconds;

  return (
    <>
      {gameState.isGameOver && gameState.game.isWinner && <Confetti />}

      <div className="flex min-h-0 flex-1 flex-col">
        <main
          ref={mainRef}
          className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden"
        >
          {/* Daily puzzle header + timer */}
          <div className="flex items-center justify-center gap-4 py-1.5">
            <span className="font-display text-sm uppercase tracking-wider text-muted-foreground">
              Daily #{loaderData.puzzleNumber}
            </span>
            {!gameState.isGameOver && (
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {formatTime(elapsed)}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowHowToPlay(true)}
              className="rounded-full border border-neutral-600 px-3 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              How to play
            </button>
          </div>

          <Form method="post" className="flex w-full flex-col items-center gap-y-3">
            <div
              ref={boardWrapRef}
              className={cn(
                'w-full px-3 sm:px-4 origin-top',
                gameState.isGameOver && 'transition-all duration-500',
              )}
              style={
                boardScale < 1
                  ? { transform: `scale(${boardScale})`, marginBottom: boardCollapsePx }
                  : undefined
              }
            >
              <div
                className="mx-auto flex max-w-lg flex-col gap-y-2 rounded-xl border border-solid border-neutral-600 bg-card p-2 text-card-foreground shadow sm:gap-y-3 sm:p-3 lg:gap-y-4 lg:p-4"
              >
                <AnimatePresence>
                  {gameState.game.submissions.map((_: unknown, i: number) => (
                    <GameRow key={i} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {!gameState.isGameOver ? (
              <GameSubmitButton elapsed={elapsed} />
            ) : null}
          </Form>

          {gameState.isGameOver ? (
            <WinLossFooter
              puzzleNumber={loaderData.puzzleNumber}
              solveTime={solveTime}
            />
          ) : null}
        </main>
      </div>

      <HowToPlay open={showHowToPlay} onOpenChange={setShowHowToPlay} />
      <Toaster />
    </>
  );
}

function WinLossFooter({
  puzzleNumber,
  solveTime,
}: {
  puzzleNumber: number;
  solveTime?: number;
}) {
  const gameState = useGameState();
  const { toast } = useToast();
  const { colorblind } = useTheme();
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);

  const decision = gameState.game.isWinner ? 'winner' : 'loss';
  const completedSubmissions = gameState.game.submissions.filter(
    (s) => s.result.length > 0,
  );

  async function handleShare() {
    const result = await shareResult(
      puzzleNumber,
      completedSubmissions,
      gameState.game.isWinner,
      gameState.game.maxGuesses,
      colorblind,
      solveTime,
    );
    toast({
      title: result === 'shared' ? 'Shared!' : 'Copied to clipboard!',
      description:
        result === 'shared'
          ? 'Result shared successfully'
          : 'Share your result with friends',
    });
  }

  function handleShareImage() {
    const url = generateShareImage(
      puzzleNumber,
      completedSubmissions,
      gameState.game.isWinner,
      gameState.game.maxGuesses,
      solveTime,
    );
    setShareImageUrl(url);
  }

  function downloadImage() {
    if (!shareImageUrl) return;
    const a = document.createElement('a');
    a.href = shareImageUrl;
    a.download = `mindmaster-${puzzleNumber}.png`;
    a.click();
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 100 }}
      transition={{ type: 'spring', stiffness: 60, damping: 12 }}
    >
      <div className="flex flex-col items-center justify-center gap-3 pb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-center font-display text-5xl uppercase sm:text-6xl">
            {decision}
          </h1>
          {solveTime != null && gameState.game.isWinner && (
            <span className="font-mono text-lg text-muted-foreground">
              {formatTime(solveTime)}
            </span>
          )}
        </div>

        {/* Answer reveal */}
        <div className="flex flex-row gap-2">
          {gameState.game.code.code.map(
            (codeColor: number, i: Key | null | undefined) => (
              <WinLossAnswer key={i} colorIndex={codeColor} />
            ),
          )}
        </div>

        {/* Action buttons — stacked on mobile, row on desktop */}
        <div className="mt-1 flex w-full max-w-xs flex-col items-stretch gap-2 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <button
            type="button"
            onClick={handleShare}
            className="font-matter rounded-3xl border-2 border-neutral-700 bg-code-green px-6 py-3 text-sm font-semibold uppercase text-white shadow-input-idle transition-all duration-150 ease-in-out hover:translate-y-[-2px] hover:shadow-input-grow active:translate-y-[2px] active:shadow-input-shrink"
          >
            Share Result
          </button>
          <button
            type="button"
            onClick={handleShareImage}
            className="font-matter rounded-3xl border-2 border-neutral-700 px-6 py-3 text-sm font-semibold uppercase shadow-input-idle transition-all duration-150 ease-in-out hover:translate-y-[-2px] hover:shadow-input-grow active:translate-y-[2px] active:shadow-input-shrink"
          >
            Share Image
          </button>
          <Link
            to="/stats"
            className="font-matter rounded-3xl border-2 border-neutral-700 px-6 py-3 text-center text-sm font-semibold uppercase shadow-input-idle transition-all duration-150 ease-in-out hover:translate-y-[-2px] hover:shadow-input-grow active:translate-y-[2px] active:shadow-input-shrink"
          >
            View Stats
          </Link>
        </div>

        {/* Share image preview */}
        {shareImageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 flex flex-col items-center gap-2"
          >
            <img
              src={shareImageUrl}
              alt="Share card"
              className="rounded-lg shadow-lg"
              style={{ maxWidth: 300 }}
            />
            <button
              type="button"
              onClick={downloadImage}
              className="text-sm font-medium text-muted-foreground underline hover:text-foreground"
            >
              Download Image
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function WinLossAnswer({ colorIndex }: { colorIndex: number }) {
  const { colorblind } = useTheme();

  return (
    <div
      className={cn(
        'flex size-12 select-none items-center justify-center rounded-full border-2 border-neutral-700 shadow-input-idle sm:size-14 lg:size-16',
        masterMindColors[colorIndex],
      )}
    >
      {colorblind && (
        <span className="text-lg font-bold text-neutral-900 lg:text-2xl">
          {colorblindSymbols[colorIndex]}
        </span>
      )}
    </div>
  );
}
