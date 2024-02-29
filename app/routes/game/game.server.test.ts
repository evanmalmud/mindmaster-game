import { calculateResult } from './game.server';

it('should return the correct results in a sorted array from correct (1) to incorrect (-1)', () => {
  // Partial
  const code = [1, 2, 3, 4];
  let submission = [4, 2, 1, 0];
  expect(calculateResult(code, submission)).toEqual([1, 0, 0, -1]);

  // All wrong
  submission = [5, 0, 5, 0];
  expect(calculateResult(code, submission)).toEqual([-1, -1, -1, -1]);

  // All right
  submission = [1, 2, 3, 4];
  expect(calculateResult(code, submission)).toEqual([1, 1, 1, 1]);
});
