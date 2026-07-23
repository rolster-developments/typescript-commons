import { valueIsDefined } from '../helpers/general-helper';

type SecurePromiseCallback<T = any> = () => Promise<T>;

export interface SecurePromise<T = any> {
  isError(): boolean;
  isInstanced(): boolean;
  isRequesting(): boolean;
  isResolved(): boolean;
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
  let error = false;
  let resolved = false;

  function isInstanced(): boolean {
    return valueIsDefined(promise$);
  }

  function isRequesting(): boolean {
    return requesting;
  }

  function isResolved(): boolean {
    return resolved;
  }

  function isError(): boolean {
    return error;
  }

  function resolve(): Promise<T> {
    if (!promise$) {
      requesting = true;
      error = false;
      resolved = false;

      promise$ = callback()
        .then((value) => {
          resolved = true;

          return value;
        })
        .catch((err) => {
          const _error = catchError?.(err);

          promise$ = undefined;
          error = true;

          if (_error) {
            return _error;
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
    error = false;
    resolved = false;
  }

  function refresh(): Promise<T> {
    reset();

    return resolve();
  }

  return {
    isError,
    isInstanced,
    isRequesting,
    isResolved,
    refresh,
    reset,
    resolve
  };
}

export function securePromiseOfValue<T = any>(value: T): SecurePromise<T> {
  return securePromise(() => Promise.resolve(value));
}
