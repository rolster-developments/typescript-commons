type ZipPromiseFactory<T> = () => Promise<T>;

type ZipPromises<T> = {
  [K in keyof T]: ZipPromiseFactory<T[K]>;
};

interface ZipPromiseOptions {
  continueOnError?: boolean;
  errorValue?: any;
}

export async function zipPromise<T extends any[]>(
  promises: ZipPromises<T>,
  options: ZipPromiseOptions = {}
): Promise<T> {
  const { continueOnError = false, errorValue = undefined } = options;

  const results: unknown[] = [];

  for (const promise of promises) {
    try {
      results.push(await promise());
    } catch (error) {
      if (!continueOnError) {
        throw error;
      }

      results.push(errorValue);
    }
  }

  return results as T;
}
