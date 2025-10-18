import { Sealed } from './sealed';

export class ViewState<L, S, E, F, V = any> extends Sealed<
  V,
  L | S | E | F,
  {
    loading: (state: L) => V;
    success: (state: S) => V;
    empty: (state: E) => V;
    failure: (state: F) => V;
  }
> {
  public static loading<L>(value?: L): ViewState<L, any, any, any> {
    return new ViewState('loading', value);
  }

  public static success<S>(value?: S): ViewState<any, S, any, any> {
    return new ViewState('success', value);
  }

  public static empty<E>(value?: E): ViewState<any, any, E, any> {
    return new ViewState('empty', value);
  }

  public static failure<F>(value?: F): ViewState<any, any, any, F> {
    return new ViewState('failure', value);
  }
}

export class ReportState<W, L, S, E, F, V = any> extends Sealed<
  V,
  W | L | S | E | F,
  {
    welcome: (state: W) => V;
    loading: (state: L) => V;
    success: (state: S) => V;
    empty: (state: E) => V;
    failure: (state: F) => V;
  }
> {
  public static welcome<W>(value?: W): ReportState<W, any, any, any, any> {
    return new ReportState('welcome', value);
  }

  public static loading<L>(value?: L): ReportState<any, L, any, any, any> {
    return new ReportState('loading', value);
  }

  public static success<S>(value?: S): ReportState<any, any, S, any, any> {
    return new ReportState('success', value);
  }

  public static empty<E>(value?: E): ReportState<any, any, any, E, any> {
    return new ReportState('empty', value);
  }

  public static failure<F>(value?: F): ReportState<any, any, any, any, F> {
    return new ReportState('failure', value);
  }
}
