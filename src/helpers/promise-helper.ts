type CatchError = (err: any) => void;

export function fromPromise<T>(value: T | Promise<T>): Promise<T> {
  return value instanceof Promise ? value : Promise.resolve(value);
}

export async function rethrow<T>(
  promise: Promise<T>,
  catchError?: CatchError
): Promise<void> {
  try {
    await promise;
  } catch (err) {
    catchError && catchError(err);

    throw err;
  }
}

export async function silence<T>(
  promise: Promise<T>,
  catchError?: CatchError
): Promise<void> {
  try {
    await promise;
  } catch (err) {
    catchError && catchError(err);

    return undefined;
  }
}

export async function unawaited<T>(
  promise: Promise<T>,
  catchError?: CatchError
): Promise<Undefined<T>> {
  try {
    return await promise;
  } catch (err) {
    catchError && catchError(err);

    return undefined;
  }
}
