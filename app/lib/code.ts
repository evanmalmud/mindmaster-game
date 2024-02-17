type Code = string[];

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

export function getUniqueCode(previousCodes?: string[][]) {
  const code = createCode();

  if (previousCodes?.some((c) => isEqualArrays(c, code))) {
    return getUniqueCode(previousCodes);
  }

  return code;
}

function createCode(): string[] {
  const code = new Array(4);

  for (let i = 0; i < code.length; i++) {
    code[i] = getRandomColor();
  }

  return code;
}

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
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
