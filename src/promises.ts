import { itIsDefined } from './helpers';

type CatchError = (err: any) => void;

export function fromPromise<T>(value: T | Promise<T>): Promise<T> {
  return value instanceof Promise ? value : Promise.resolve(value);
}

export function resolvePromise<T>(
  promise: Promise<T>,
  catchError?: CatchError
): Promise<void> {
  return promise
    .then(() => undefined)
    .catch((err) => {
      catchError && catchError(err);

      throw err;
    });
}

export function voidPromise<T>(
  promise: Promise<T>,
  catchError?: CatchError
): Promise<void> {
  return promise
    .then(() => undefined)
    .catch((err) => {
      catchError && catchError(err);

      return undefined;
    });
}

export function catchPromise<T>(
  promise: Promise<T>,
  catchError?: CatchError
): Promise<Undefined<T>> {
  return promise.catch((err) => {
    catchError && catchError(err);

    return undefined;
  });
}

type ZipPromiseCallback<T extends any> = () => Promise<T>;

type ZipPromiseTuple<T> = {
  [K in keyof T]: ZipPromiseCallback<T[K]>;
};

interface ZipPromisesOptions<T extends any[]> {
  callbacks: [...ZipPromiseTuple<T>];
  catchError: (error: any) => void;
  index: number;
  result: T;
  resolve: (result: T) => void;
}

function zipResolveCallbacks<T extends any[]>(
  options: ZipPromisesOptions<T>
): void {
  const { callbacks, catchError, index, resolve, result } = options;

  if (index === callbacks.length) {
    return resolve(result);
  }

  const promise = callbacks[index];

  new Promise(() => {
    promise()
      .then((value) => {
        result.push(value);

        return zipResolveCallbacks({
          ...options,
          index: index + 1,
          result
        });
      })
      .catch((err) => {
        return catchError(err);
      });
  });
}

export function zipPromise<T extends any[]>(
  callbacks: [...ZipPromiseTuple<T>]
): Promise<T> {
  const result: any = [];

  return new Promise<T>((resolve, reject) => {
    zipResolveCallbacks<T>({
      callbacks,
      catchError: (err) => {
        reject(err);
      },
      index: 0,
      resolve: (result) => {
        resolve(result);
      },
      result
    });
  });
}

type SecurePromiseCallback<T = any> = () => Promise<T>;

export interface SecurePromise<T = any> {
  isInstanced(): boolean;
  isRequesting(): boolean;
  refresh(): Promise<T>;
  reset(): void;
  resolve(): Promise<T>;
}

export function securePromise<T = any>(
  callback: SecurePromiseCallback<T>,
  catchError?: (err: any) => Undefined<T>
): SecurePromise<T> {
  let promise$: Undefined<Promise<T>> = undefined;
  let _isRequesting = false;

  function isInstanced(): boolean {
    return itIsDefined(promise$);
  }

  function isRequesting(): boolean {
    return _isRequesting;
  }

  function resolve(): Promise<T> {
    if (!promise$) {
      _isRequesting = true;

      promise$ = callback()
        .catch((err) => {
          const errorValue = catchError && catchError(err);

          reset();

          if (errorValue) {
            return errorValue;
          }

          throw err;
        })
        .finally(() => {
          _isRequesting = false;
        });
    }

    return promise$;
  }

  function reset(): void {
    promise$ = undefined;
  }

  function refresh(): Promise<T> {
    promise$ = undefined;

    return resolve();
  }

  return {
    isInstanced,
    isRequesting,
    refresh,
    reset,
    resolve
  };
}
