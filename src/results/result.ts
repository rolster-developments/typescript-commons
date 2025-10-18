interface Success<T> {
  isError: false;
  value: T;
}

interface Failure<E> {
  isError: true;
  value: E;
}

export type Result<S, F = string> = Success<S> | Failure<F>;

export class ResultPattern {
  private constructor() {}

  public static success<S>(value: S): Result<S, never> {
    return {
      isError: false,
      value
    };
  }

  public static failure<F>(error: F): Result<never, F> {
    return {
      isError: true,
      value: error
    };
  }
}
