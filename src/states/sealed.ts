export type SealedState<R> = Record<string, (value?: any) => R>;

export interface SealedAbstract<R, T extends SealedState<R>, V, C = T> {
  is(key: keyof T): boolean;

  otherwise(otherwise: () => void): this;

  when(resolver: C, otherwise?: () => void): V;
}

export class SealedPartial<R, V, T extends SealedState<R>>
  implements SealedAbstract<R, T, Undefined<R>, Partial<T>>
{
  protected _otherwise?: () => void;

  protected constructor(
    protected key: keyof T,
    protected value?: V
  ) {}

  public otherwise(otherwise: () => void): this {
    this._otherwise = otherwise;

    return this;
  }

  public when(resolver: Partial<T>, otherwise?: () => void): Undefined<R> {
    const handler = resolver[this.key];

    const _otherwise = otherwise || this._otherwise;

    _otherwise && _otherwise();

    return handler ? handler(this.value) : undefined;
  }

  public is(key: keyof T): boolean {
    return this.key === key;
  }
}

export class Sealed<R, V, T extends SealedState<R>>
  extends SealedPartial<R, V, T>
  implements SealedAbstract<R, T, R, T>
{
  public when(resolver: T, otherwise?: () => void): R {
    const handler = resolver[this.key];

    const _otherwise = otherwise ?? this._otherwise;

    _otherwise && _otherwise();

    if (handler) {
      return handler(this.value);
    }

    throw Error('Sealed class could not resolve call');
  }
}
