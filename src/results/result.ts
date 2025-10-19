interface Success<T> {
  isError: false;
  value: T;
}

interface Failure<E> {
  isError: true;
  value: E;
}

export type Result<S, F = string> = Success<S> | Failure<F>;

export class ResultFactory {
  private constructor() {}

  public static success<S>(value: S): Readonly<Result<S, never>> {
    return Object.freeze({ isError: false, value });
  }

  public static failure<F>(error: F): Readonly<Result<never, F>> {
    return Object.freeze({ isError: true, value: error });
  }
}
