import { freeze } from '../helpers/general-helper';

export type Observer<T = any> = (value: Readonly<T>) => void;

export interface Observable<T = any> {
  close: () => void;
  listen(observer: Observer<T>): Unsubscription;
  next(value: T): void;
  subscribe(observer: Observer<T>): Unsubscription;
  readonly value: T;
}

class ManagerObservable<T = any> implements Observable<T> {
  private observers: Observer<T>[] = [];

  private isClosed = false;

  private _value: Readonly<T>;

  constructor(value: T) {
    this._value = freeze(value);
  }

  public get value(): Readonly<T> {
    return this._value;
  }

  public subscribe(observer: Observer<T>): Unsubscription {
    this.observers.push(observer);

    observer(this._value);

    return this.unsubscriptor(observer);
  }

  public listen(observer: Observer<T>): Unsubscription {
    this.observers.push(observer);

    return this.unsubscriptor(observer);
  }

  public next(value: T): void {
    if (!this.isClosed) {
      this._value = freeze(value);

      this.observers.forEach((observer) => {
        observer(this._value);
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
export function observable<T>(value: T): Observable<T>;
export function observable<T>(value?: T): Observable<T | undefined> {
  return new ManagerObservable(value);
}
