import { Observer, observable } from '../objects/observable';
import { SealedPartial, SealedState } from '../states/sealed';

interface StreamResponse<T> {
  response: T;
  responseTime: number;
}

interface StreamState<S, V = any> extends SealedState<V> {
  loading: () => V;
  success: (state: StreamResponse<S>) => V;
  failure: (error: any) => V;
}

export class Stream<S, V = any> extends SealedPartial<
  V,
  StreamResponse<S>,
  StreamState<S, V>
> {
  public static loading(): Stream<any> {
    return new Stream('loading');
  }

  public static success<S>(value: StreamResponse<S>): Stream<S> {
    return new Stream('success', value);
  }

  public static failure(error: any): Stream<any> {
    return new Stream('failure', error);
  }
}

class StreamStatus<T, E = any> {
  private constructor(
    public readonly isLoading: boolean,
    public readonly isSuccessful: boolean,
    public readonly isError: boolean,
    public readonly value?: T,
    public readonly error?: E
  ) {}

  public static loading(): StreamStatus<any, any> {
    return new StreamStatus(true, false, false);
  }

  public static successful<T>(value?: T): StreamStatus<T, any> {
    return new StreamStatus(false, true, false, value);
  }

  public static error<E = any>(error?: E): StreamStatus<any, E> {
    return new StreamStatus(false, false, true, undefined, error);
  }
}

type StreamObserver<T> = (observer: Observer<Stream<T>>) => Unsubscription;

interface StreamSubscription<T> {
  subscribe: StreamObserver<T>;
}

interface StreamStateSubscription<T, V> {
  subscribe: (state: Partial<StreamState<T, V>>) => Unsubscription;
}

interface StreamStatusSubscription<T, E = any> {
  subscribe: (observer: (status: StreamStatus<T, E>) => void) => Unsubscription;
}

export function stream<T>(promise: Promise<T>): StreamSubscription<T> {
  const observable$ = observable(Stream.loading());

  const firstTime = Date.now();

  promise
    .then((response) => {
      observable$.next(
        Stream.success({
          response,
          responseTime: Date.now() - firstTime
        })
      );
    })
    .catch((error) => {
      observable$.next(Stream.failure(error));
    });

  return {
    subscribe: (observer) => {
      return observable$.subscribe(observer);
    }
  };
}

export function streamResolver<T, V = any>(
  promise: Promise<T>
): StreamStateSubscription<T, V> {
  return {
    subscribe: (resolver) => {
      return stream(promise).subscribe((state) => {
        state.when(resolver);
      });
    }
  };
}

export function streamStatus<T, E = any>(
  promise: Promise<T>
): StreamStatusSubscription<T, E> {
  return {
    subscribe: (observer) => {
      return stream(promise).subscribe((state) => {
        observer(
          state.when({
            loading: () => StreamStatus.loading(),
            success: ({ response }) => StreamStatus.successful(response),
            failure: (error) => StreamStatus.error(error)
          })
        );
      });
    }
  };
}
