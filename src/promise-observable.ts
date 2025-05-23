import { Observer, observable } from './observable';
import { PartialSealed, SealedState } from './sealed';

interface PromiseResponse<T> {
  response: T;
  responseTime: number;
}

interface PromiseState<S, V = any> extends SealedState<V> {
  loading: () => V;
  success: (state: PromiseResponse<S>) => V;
  failure: (error: any) => V;
}

export class PromiseSealed<S, V = any> extends PartialSealed<
  V,
  PromiseResponse<S>,
  PromiseState<S, V>
> {
  public static loading(): PromiseSealed<any> {
    return new PromiseSealed('loading');
  }

  public static success<S>(value: PromiseResponse<S>): PromiseSealed<S> {
    return new PromiseSealed('success', value);
  }

  public static failure(error: any): PromiseSealed<any> {
    return new PromiseSealed('failure', error);
  }
}

class PromiseStatus<T, E = any> {
  private constructor(
    public readonly isLoading: boolean,
    public readonly isSuccessful: boolean,
    public readonly isError: boolean,
    public readonly value?: T,
    public readonly error?: E
  ) {}

  public static loading(): PromiseStatus<any, any> {
    return new PromiseStatus(true, false, false);
  }

  public static successful<T>(value?: T): PromiseStatus<T, any> {
    return new PromiseStatus(false, true, false, value);
  }

  public static error<E = any>(error?: E): PromiseStatus<any, E> {
    return new PromiseStatus(false, false, true, undefined, error);
  }
}

type SealedObserver<T> = (
  observer: Observer<PromiseSealed<T>>
) => Unsubscription;

interface SealedSubscription<T> {
  subscribe: SealedObserver<T>;
}

interface StateSubscription<T, V> {
  subscribe: (state: Partial<PromiseState<T, V>>) => Unsubscription;
}

interface StatusSubscription<T, E = any> {
  subscribe: (
    observer: (status: PromiseStatus<T, E>) => void
  ) => Unsubscription;
}

export function rxPromise<T>(promise: Promise<T>): SealedSubscription<T> {
  const observable$ = observable(PromiseSealed.loading());

  const firstTime = Date.now();

  promise
    .then((response) => {
      observable$.next(
        PromiseSealed.success({
          response,
          responseTime: Date.now() - firstTime
        })
      );
    })
    .catch((error) => {
      observable$.next(PromiseSealed.failure(error));
    });

  return {
    subscribe: (observer) => {
      return observable$.subscribe(observer);
    }
  };
}

export function rxPromiseResolve<T, V = any>(
  promise: Promise<T>
): StateSubscription<T, V> {
  return {
    subscribe: (resolver) => {
      return rxPromise(promise).subscribe((state) => {
        state.when(resolver);
      });
    }
  };
}

export function rxPromiseStatus<T, E = any>(
  promise: Promise<T>
): StatusSubscription<T, E> {
  return {
    subscribe: (observer) => {
      return rxPromise(promise).subscribe((state) => {
        observer(
          state.when({
            loading: () => PromiseStatus.loading(),
            success: ({ response }) => PromiseStatus.successful(response),
            failure: (error) => PromiseStatus.error(error)
          })
        );
      });
    }
  };
}
