import type { Submission } from '~/routes/_default.game/game.server';

const RESULT_EMOJI: Record<number, string> = {
  1: '🟢',   // correct color and spot
  0: '🟡',   // correct color
  '-1': '⬛', // incorrect
};

const RESULT_EMOJI_COLORBLIND: Record<number, string> = {
  1: '🟩',
  0: '🟨',
  '-1': '⬜',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Generates a Wordle-style share text for clipboard.
 */
export function generateShareText(
  puzzleNumber: number,
  submissions: Submission[],
  isWinner: boolean,
  maxGuesses: number,
  colorblind: boolean = false,
  solveTime?: number,
): string {
  const emoji = colorblind ? RESULT_EMOJI_COLORBLIND : RESULT_EMOJI;
  const score = isWinner ? `${submissions.length}/${maxGuesses}` : `X/${maxGuesses}`;
  const timeStr = solveTime && isWinner ? ` ⏱ ${formatTime(solveTime)}` : '';

  const grid = submissions
    .map((sub) => sub.result.map((r) => emoji[r] ?? '⬛').join(''))
    .join('\n');

  const url = typeof window !== 'undefined' ? window.location.origin : '';

  return `MindMaster #${puzzleNumber} 🧠 ${score}${timeStr}\n\n${grid}\n\n${url}`;
}

/**
 * Generates an image card as a data URL for social sharing.
 */
export function generateShareImage(
  puzzleNumber: number,
  submissions: Submission[],
  isWinner: boolean,
  maxGuesses: number,
  solveTime?: number,
): string {
  const canvas = document.createElement('canvas');
  const width = 400;
  const height = 340;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#1e1e2e';
  ctx.beginPath();
  roundRect(ctx, 0, 0, width, height, 16);
  ctx.fill();

  // Title
  ctx.fillStyle = '#cdd6f4';
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MindMaster', width / 2, 40);

  // Puzzle number, score, and time
  const score = isWinner ? `${submissions.length}/${maxGuesses}` : `X/${maxGuesses}`;
  const timeStr = solveTime && isWinner ? `  ⏱ ${formatTime(solveTime)}` : '';
  ctx.fillStyle = '#a6adc8';
  ctx.font = '16px system-ui, -apple-system, sans-serif';
  ctx.fillText(`#${puzzleNumber}  🧠  ${score}${timeStr}`, width / 2, 65);

  // Result grid
  const dotSize = 28;
  const gap = 6;
  const gridWidth = 4 * dotSize + 3 * gap;
  const startX = (width - gridWidth) / 2;
  const startY = 85;

  const colors: Record<number, string> = {
    1: '#6aaa64',   // green
    0: '#c9b458',   // yellow
    '-1': '#3a3a4c', // dark gray
  };

  for (let row = 0; row < submissions.length; row++) {
    for (let col = 0; col < 4; col++) {
      const x = startX + col * (dotSize + gap);
      const y = startY + row * (dotSize + gap);
      const result = submissions[row].result[col];

      ctx.fillStyle = colors[result] ?? '#3a3a4c';
      ctx.beginPath();
      ctx.arc(x + dotSize / 2, y + dotSize / 2, dotSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Footer
  ctx.fillStyle = '#585b70';
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  const host = typeof window !== 'undefined' ? window.location.host : '';
  ctx.fillText(host, width / 2, height - 16);

  return canvas.toDataURL('image/png');
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Copies share text to clipboard and optionally shares via Web Share API.
 */
export async function shareResult(
  puzzleNumber: number,
  submissions: Submission[],
  isWinner: boolean,
  maxGuesses: number,
  colorblind: boolean = false,
  solveTime?: number,
): Promise<'copied' | 'shared'> {
  const text = generateShareText(puzzleNumber, submissions, isWinner, maxGuesses, colorblind, solveTime);

  if (navigator.share) {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch {
      // User cancelled or share failed, fall back to clipboard
    }
  }

  await navigator.clipboard.writeText(text);
  return 'copied';
}
