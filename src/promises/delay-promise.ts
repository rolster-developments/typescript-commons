import { fromPromise } from '../helpers/promise-helper';

export function delayPromise<T>(
  value: () => T | Promise<T>,
  miliseconds: number
): Promise<T> {
  return new Promise<T>((resolve) => {
    setTimeout(() => {
      fromPromise(value()).then((result) => {
        resolve(result);
      });
    }, miliseconds);
  });
}
