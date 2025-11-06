interface Success<T> {
  isSuccess: true;
  value: T;
}

interface Failure<E> {
  isSuccess: false;
  value: E;
}

export type Result<S, F = string> = Success<S> | Failure<F>;

export class ResultFactory {
  private constructor() {}

  public static success<S>(value: S): Readonly<Result<S, never>> {
    return Object.freeze({ isSuccess: true, value });
  }

  public static failure<F>(error: F): Readonly<Result<never, F>> {
    return Object.freeze({ isSuccess: false, value: error });
  }
}
