export function ceilDecimals(number: number, size: number): number {
  const factor = Math.pow(10, size);

  return Math.ceil(number * factor) / factor;
}

export function floorDecimals(number: number, size: number): number {
  const factor = Math.pow(10, size);

  return Math.floor(number * factor) / factor;
}
