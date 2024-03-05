import { calculateResult } from './game.server';

it('should return the correct results in a sorted array from correct (1) to incorrect (-1)', () => {
  // Partial
  let code = [1, 2, 3, 4];
  let submission = [4, 2, 1, 0];
  expect(calculateResult(code, submission)).toEqual([1, 0, 0, -1]);

  // All right
  submission = [1, 2, 3, 4];
  expect(calculateResult(code, submission)).toEqual([1, 1, 1, 1]);

  // All wrong
  submission = [5, 0, 5, 0];
  expect(calculateResult(code, submission)).toEqual([-1, -1, -1, -1]);

  // Duplicates
  submission = [1, 1, 3, 3];
  expect(calculateResult(code, submission)).toEqual([1, 1, -1, -1]);

  // Double duplicates
  code = [1, 3, 1, 3];
  expect(calculateResult(code, submission)).toEqual([1, 1, 0, 0]);

  code = [3, 3, 1, 0];
  submission = [0, 1, 0, 1];
  expect(calculateResult(code, submission)).toEqual([0, 0, -1, -1]);
});
