import { valueIsDefined } from '../helpers/general-helper';

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
  let requesting = false;

  function isInstanced(): boolean {
    return valueIsDefined(promise$);
  }

  function isRequesting(): boolean {
    return requesting;
  }

  function resolve(): Promise<T> {
    if (!promise$) {
      requesting = true;

      promise$ = callback()
        .catch((err) => {
          const error = catchError && catchError(err);

          reset();

          if (error) {
            return error;
          }

          throw err;
        })
        .finally(() => {
          requesting = false;
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

export function securePromiseOfValue<T = any>(value: T): SecurePromise<T> {
  return securePromise(() => Promise.resolve(value));
}
