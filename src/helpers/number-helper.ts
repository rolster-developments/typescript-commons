export function round(number: number, precision = 0): number {
  const _precision = Math.pow(10, precision);

  return Math.round(number * _precision) / _precision;
}

export function ceil(number: number, precision = 0): number {
  const _precision = Math.pow(10, precision);

  return Math.ceil(number * _precision) / _precision;
}

export function floor(number: number, precision = 0): number {
  const _precision = Math.pow(10, precision);

  return Math.floor(number * _precision) / _precision;
}

export function halfToEven(number: number, precision = 0): number {
  const _precision = Math.pow(10, precision);

  const _number = Math.abs(number) * _precision;

  const integer = Math.trunc(_number);
  const decimal = _number - integer;

  let result;

  if (decimal < 0.5) {
    result = integer;
  } else if (decimal > 0.5) {
    result = integer + 1;
  } else {
    result = integer + (integer % 2);
  }

  return (number < 0 ? -result : result) / _precision;
}
