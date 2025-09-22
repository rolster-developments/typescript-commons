import { PartialSealed } from './sealed';

export class Either<S, F, V = any> extends PartialSealed<
  V,
  S | F,
  {
    success: (state: S) => V;
    failure: (state: F) => V;
  }
> {
  public static success<S>(value?: S): Either<S, any> {
    return new Either('success', value);
  }

  public static failure<F>(value?: F): Either<any, F> {
    return new Either('failure', value);
  }
}
