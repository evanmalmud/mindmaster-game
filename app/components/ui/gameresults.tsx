import { useloadGameState } from '~/routes/game';
import { cn } from '~/utils';

export function GameResults({ index }: { index: number }) {
  const gameState = useloadGameState();
  // Create Results
  const gameResults = [];
  for (let i = 0; i < 4; i++) {
    if (i < gameState.results[index]?.correctColorAndSpot) {
      gameResults.push({ key: i, correctColorAndSpot: true });
    } else if (
      i <
      gameState.results[index]?.correctColorAndSpot +
        gameState.results[index]?.correctColor
    ) {
      gameResults.push({ key: i, correctColor: true });
    } else {
      gameResults.push({ key: i });
    }
  }

  if (gameState.activeRow == index && !gameState.gameOver) {
    return (
      <div className={cn('ml-auto grid content-center justify-center gap-1')}>
        <GameSubmitButton />
      </div>
    );
  }
  return (
    <div
      className={cn(
        'ml-auto grid grid-cols-2 content-center justify-center gap-1 px-2',
      )}
    >
      {gameResults.map((row) => (
        <GameResultButton
          key={row.key}
          correctColor={row.correctColor}
          correctColorAndSpot={row.correctColorAndSpot}
        />
      ))}
    </div>
  );
}

function GameResultButton({
  correctColor,
  correctColorAndSpot,
}: {
  correctColor?: boolean;
  correctColorAndSpot?: boolean;
}) {
  let className = '';
  if (correctColorAndSpot) {
    className = 'bg-ctp-green';
  } else if (correctColor) {
    className = 'bg-ctp-red';
  }
  return (
    <div>
      <button
        type="button"
        className={cn(
          'size-8 rounded-full border border-solid border-black',
          className,
        )}
      ></button>
    </div>
  );
}

function GameSubmitButton() {
  return (
    <div>
      <button
        type="submit"
        className={cn(
          'rounded-full border border-solid border-black bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700',
        )}
      >
        Submit
      </button>
    </div>
  );
}
