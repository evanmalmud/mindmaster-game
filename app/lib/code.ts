import * as defaults from './constants';

const COLORS = defaults.masterMindColors;
const CODE_LENGTH = 4;

// --- Seeded PRNG (mulberry32) ---
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

// --- Daily puzzle date ---

/**
 * Returns the current puzzle date string (YYYY-MM-DD).
 * Resets at 2am EST (7am UTC) every day.
 *
 * Set PUZZLE_DATE_OVERRIDE env var (e.g. "2026-04-10") to force a specific day for testing.
 */
export function getPuzzleDate(now: Date = new Date()): string {
  const override = typeof process !== 'undefined' && process.env.PUZZLE_DATE_OVERRIDE;
  if (override) {
    return override;
  }

  const utcMs = now.getTime();
  // 2am EST = 7am UTC. Subtract 7 hours to align the "day boundary" to 7am UTC.
  const adjusted = new Date(utcMs - 7 * 60 * 60 * 1000);
  const year = adjusted.getUTCFullYear();
  const month = String(adjusted.getUTCMonth() + 1).padStart(2, '0');
  const day = String(adjusted.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the puzzle number (days since epoch puzzle).
 */
export function getPuzzleNumber(puzzleDate: string): number {
  const epoch = new Date('2026-04-04');
  const current = new Date(puzzleDate);
  return Math.floor((current.getTime() - epoch.getTime()) / (24 * 60 * 60 * 1000)) + 1;
}

/**
 * Creates a deterministic 4-color code for a given puzzle date.
 * Same date always produces the same code.
 */
export function createDailyCode(puzzleDate: string): number[] {
  const seed = hashString(`mindmaster-daily-${puzzleDate}`);
  const rng = mulberry32(seed);
  const code = new Array(CODE_LENGTH);
  for (let i = 0; i < CODE_LENGTH; i++) {
    code[i] = Math.floor(rng() * COLORS.length);
  }
  return code;
}

// --- Legacy random code (kept for migration/testing) ---

export function getUniqueCode(previousCodes?: number[][]) {
  const code = createCode();

  if (previousCodes?.some((c) => isEqualArrays(c, code))) {
    return getUniqueCode(previousCodes);
  }

  return code;
}

export function createCode(): number[] {
  const code = new Array(CODE_LENGTH);

  for (let i = 0; i < CODE_LENGTH; i++) {
    code[i] = getRandomColor();
  }

  return code;
}

function getRandomColor() {
  return Math.floor(Math.random() * COLORS.length);
}

function isEqualArrays<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}
