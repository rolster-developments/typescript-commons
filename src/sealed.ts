export type SealedState<R> = Record<string, (value?: any) => R>;

export class Sealed<R, V, T extends SealedState<R>> {
  private _otherwise?: () => void;

  protected constructor(
    private key: keyof T,
    private value?: V
  ) {}

  public otherwise(otherwise: () => void): this {
    this._otherwise = otherwise;

    return this;
  }

  public when(resolver: T, otherwise?: () => void): R {
    const handler = resolver[this.key];

    const _otherwise = otherwise ?? this._otherwise;

    _otherwise && _otherwise();

    if (handler) {
      return handler(this.value);
    }

    /* istanbul ignore next */
    throw Error('Sealed class could not resolve call');
  }

  public is(key: keyof T): boolean {
    return this.key === key;
  }
}

export class PartialSealed<R, V, T extends SealedState<R>> {
  private _otherwise?: () => void;

  protected constructor(
    private key: keyof T,
    private value?: V
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
