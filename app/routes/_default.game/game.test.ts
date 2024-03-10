import { calculateResult } from './game';

describe('calculateResult', () => {
  let code: number[];
  let submission: number[];

  it('should correctly evaluate partially correct submissions', () => {
    code = [1, 2, 3, 4];
    submission = [4, 2, 1, 0];
    expect(calculateResult(code, submission)).toEqual([1, 0, 0, -1]);

    submission = [1, 2, 3, 0];
    expect(calculateResult(code, submission)).toEqual([1, 1, 1, -1]);

    submission = [1, 2, 4, 0];
    expect(calculateResult(code, submission)).toEqual([1, 1, 0, -1]);

    submission = [1, 2, 5, 0];
    expect(calculateResult(code, submission)).toEqual([1, 1, -1, -1]);
  });

  it('should correctly evaluate completely correct submissions', () => {
    code = [1, 2, 3, 4];
    submission = [1, 2, 3, 4];
    expect(calculateResult(code, submission)).toEqual([1, 1, 1, 1]);
  });

  it('should correctly evaluate completely incorrect submissions', () => {
    code = [1, 2, 3, 4];
    submission = [5, 0, 5, 0];
    expect(calculateResult(code, submission)).toEqual([-1, -1, -1, -1]);
  });

  it('should correctly evaluate submissions with duplicate values', () => {
    code = [1, 2, 3, 4];
    submission = [1, 1, 3, 3];
    expect(calculateResult(code, submission)).toEqual([1, 1, -1, -1]);
  });

  it('should correctly evaluate submissions with double duplicate values', () => {
    code = [1, 3, 1, 3];
    submission = [1, 1, 3, 3];
    expect(calculateResult(code, submission)).toEqual([1, 1, 0, 0]);
  });

  it('should correctly evaluate submissions with all misplaced values', () => {
    code = [3, 3, 1, 1];
    submission = [1, 1, 3, 3];
    expect(calculateResult(code, submission)).toEqual([0, 0, 0, 0]);
  });

  it('should correctly evaluate submissions with only misplaced or incorrect values', () => {
    code = [3, 3, 1, 1];
    submission = [0, 0, 3, 3];
    expect(calculateResult(code, submission)).toEqual([0, 0, -1, -1]);

    code = [3, 3, 3, 1];
    submission = [1, 0, 0, 0];
    expect(calculateResult(code, submission)).toEqual([0, -1, -1, -1]);
  });
});
