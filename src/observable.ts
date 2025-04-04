export type Observer<T = any> = (value: T) => void;

export interface Observable<T = any> {
  next(state: T): void;
  readonly state: T;
  subscribe(observer: Observer<T>): Unsubscription;
}

class RolsterObservable<T = any> implements Observable<T> {
  private observers: Observer<T>[] = [];

  private _state: T;

  constructor(state: T) {
    this._state = state;
  }

  public get state(): T {
    return this._state;
  }

  public subscribe(observer: Observer<T>): Unsubscription {
    this.observers.push(observer);

    observer(this._state);

    return () => {
      this.observers = this.observers.filter(
        (_observer) => _observer !== observer
      );
    };
  }

  public next(state: T): void {
    this._state = state;

    this.observers.forEach((observer) => {
      observer(state);
    });
  }
}

export function observable<T>(state: T): Observable<T>;
export function observable<T>(): Observable<T | undefined>;
export function observable<T>(state?: T): Observable<T | undefined> {
  return new RolsterObservable(state);
}
