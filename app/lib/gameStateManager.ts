/* eslint-disable @typescript-eslint/prefer-for-of */
export type GameState = {
  code: number[];
  activeRow: number;
  results: submissionResult[];
  submissions: number[][];
  gameOver: boolean;
  isWinner: boolean;
};

export type submissionResult = {
  correctColorAndSpot: number;
  correctColor: number;
};

export function calculateResults(code: number[], submission: number[]) {
  let correctColorAndSpot = 0;
  let correctColor = 0;
  const temp: number[] = Object.assign([], code);
  for (let i = 0; i < submission.length; i++) {
    if (temp.indexOf(submission[i]) > -1) {
      temp.splice(temp.indexOf(submission[i]), 1);
      correctColor++;
    }
  }

  for (let i = 0; i < submission.length; i++) {
    if (code[i] == submission[i]) {
      correctColorAndSpot++;
    }
  }
  correctColor = correctColor - correctColorAndSpot;
  return { correctColorAndSpot, correctColor };
}
