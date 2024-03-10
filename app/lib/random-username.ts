export function generateFromEmail(
  email: string,
  randomDigits?: number,
): string {
  // Retrieve name from email address
  const nameParts = email.replace(/@.+/, '');
  // Replace all special characters like "@ . _ ";
  const name = nameParts.replace(/[&/\\#,+()$~%._@'":*?<>{}]/g, '');
  // Create and return unique username
  return name + randomNumber(randomDigits);
}

function randomNumber(maxNumber: number | undefined) {
  let randomNumberString;
  switch (maxNumber) {
    case 1:
      randomNumberString = Math.floor(getRandomInt(1, 9)).toString();
      break;
    case 2:
      randomNumberString = Math.floor(getRandomInt(10, 90)).toString();
      break;
    case 3:
      randomNumberString = Math.floor(getRandomInt(100, 900)).toString();
      break;
    case 4:
      randomNumberString = Math.floor(getRandomInt(1000, 9000)).toString();
      break;
    case 5:
      randomNumberString = Math.floor(getRandomInt(10000, 90000)).toString();
      break;
    case 6:
      randomNumberString = Math.floor(getRandomInt(100000, 900000)).toString();
      break;
    default:
      randomNumberString = '';
      break;
  }
  return randomNumberString;
}

function getRandomInt(min: number, max: number): number {
  if (min > max) {
    throw new Error('Minimum should not be greater than maximum');
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
