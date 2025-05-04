import { clone, freeze } from './helpers';

export type Observer<T = any> = (value: T) => void;

export interface Observable<T = any> {
  close: () => void;
  listen(observer: Observer<T>): Unsubscription;
  next(state: T): void;
  readonly state: T;
  subscribe(observer: Observer<T>): Unsubscription;
}

class ObservableState<T = any> implements Observable<T> {
  private observers: Observer<T>[] = [];

  private isClosed = false;

  private value: T;

  constructor(state: T) {
    this.value = clone(state);
  }

  public get state(): Readonly<T> {
    return typeof this.value === 'object'
      ? freeze(clone(this.value))
      : this.value;
  }

  public subscribe(observer: Observer<T>): Unsubscription {
    this.observers.push(observer);

    observer(clone(this.value));

    return this.unsubscriptor(observer);
  }

  public listen(observer: Observer<T>): Unsubscription {
    this.observers.push(observer);

    return this.unsubscriptor(observer);
  }

  public next(state: T): void {
    if (!this.isClosed) {
      this.value = clone(state);

      this.observers.forEach((observer) => {
        observer(state);
      });
    }
  }

  public close(): void {
    this.isClosed = true;
    this.observers = [];
  }

  private unsubscriptor(observer: Observer<T>): Unsubscription {
    return () => {
      this.observers = this.observers.filter(
        (_observer) => _observer !== observer
      );
    };
  }
}

export function observable<T>(): Observable<T | undefined>;
export function observable<T>(state: T): Observable<T>;
export function observable<T>(state?: T): Observable<T | undefined> {
  return new ObservableState(state);
}
