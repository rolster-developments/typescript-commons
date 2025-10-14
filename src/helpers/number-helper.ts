export function round(number: number, precision = 0): number {
  const _precision = Math.pow(10, precision);

  return Math.round(number * _precision) / _precision;
}

export function roundCeil(number: number, precision = 0): number {
  const _precision = Math.pow(10, precision);

  return Math.ceil(number * _precision) / _precision;
}

export function roundFloor(number: number, precision = 0): number {
  const _precision = Math.pow(10, precision);

  return Math.floor(number * _precision) / _precision;
}

export function roundHalfToEven(number: number, precision = 0): number {
  const _precision = Math.pow(10, precision);

  const numberAbsolute = Math.abs(number) * _precision;

  const integerPart = Math.trunc(numberAbsolute);
  const decimalPart = numberAbsolute - integerPart;

  let result;

  if (decimalPart < 0.5) {
    result = integerPart;
  } else if (decimalPart > 0.5) {
    result = integerPart + 1;
  } else {
    result = integerPart + (integerPart % 2);
  }

  return (number < 0 ? -result : result) / _precision;
}
