export const RESULT_MAP = {
  incorrect: -1,
  correctColor: 0,
  correctColorAndSpot: 1,
};

/**
 * Calculates the results and returns an array of numbers that represent the 3
 * possible states:
 *
 * 1: Correct color and spot
 * 0: Correct color
 * -1: Incorrect
 */
export function calculateResult(code: number[], submission: number[]) {
  const result: number[] = Array(code.length);
  const temp = [...code];

  // Match all fully correct answers first
  for (let i = 0; i < submission.length; i++) {
    if (code[i] === submission[i]) {
      result[i] = RESULT_MAP.correctColorAndSpot;
      temp[i] = -1;
    }
  }

  // Loop again to match misplaced correct colors or mark incomplete
  for (let i = 0; i < submission.length; i++) {
    // If result already exists it means we marked this value as correct color
    // and spot so we can skip to the next value
    if (typeof result[i] === 'number') {
      continue;
    }

    const misplacedIndex = temp.indexOf(submission[i]);
    if (misplacedIndex > -1) {
      result[i] = RESULT_MAP.correctColor;
      temp[misplacedIndex] = -1;
      continue;
    }

    result[i] = RESULT_MAP.incorrect;
  }

  // Sort by descending order to have correct answers first since that is the
  // order we display them in
  return result.sort((a, b) => b - a);
}
