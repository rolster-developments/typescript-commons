type ZipPromiseFactory<T> = () => Promise<T>;

type ZipPromiseFactories<T> = {
  [K in keyof T]: ZipPromiseFactory<T[K]>;
};

interface ZipPromiseOptions {
  continueOnError?: boolean;
  errorValue?: any;
}

export async function zipPromise<T extends any[]>(
  factories: ZipPromiseFactories<T>,
  options: ZipPromiseOptions = {}
): Promise<T> {
  const { continueOnError = false, errorValue = undefined } = options;

  const results: unknown[] = [];

  for (const factory of factories) {
    try {
      results.push(await factory());
    } catch (error) {
      if (!continueOnError) {
        throw error;
      }

      results.push(errorValue);
    }
  }

  return results as T;
}
