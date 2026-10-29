import { Sealed, SealedPartial, SealedState } from './sealed';

class TestSealedPartial<R, V, T extends SealedState<R>> extends SealedPartial<
  R,
  V,
  T
> {
  public constructor(key: keyof T, value?: V) {
    super(key, value);
  }
}

class TestSealed<R, V, T extends SealedState<R>> extends Sealed<R, V, T> {
  public constructor(key: keyof T, value?: V) {
    super(key, value);
  }
}

describe('SealedPartial', () => {
  it('should check state with is()', () => {
    const instance = new TestSealedPartial('active', 42);

    expect(instance.is('active')).toBe(true);
    expect(instance.is('inactive')).toBe(false);
  });

  it('should resolve via when with matching key', () => {
    const instance = new TestSealedPartial('active', 42);

    const result = instance.when({
      active: (value) => `active-${value}`,
      inactive: () => 'inactive'
    });

    expect(result).toBe('active-42');
  });

  it('should return undefined when resolver key is missing', () => {
    const instance = new TestSealedPartial('active', 42);

    const result = instance.when({});

    expect(result).toBeUndefined();
  });

  it('should call otherwise callback', () => {
    const instance = new TestSealedPartial('active', 42);
    const otherwise = vi.fn();

    instance.when({}, otherwise);

    expect(otherwise).toHaveBeenCalled();
  });

  it('should call otherwise from instance method', () => {
    const instance = new TestSealedPartial('active', 42);
    const otherwise = vi.fn();

    instance.otherwise(otherwise).when({});

    expect(otherwise).toHaveBeenCalled();
  });
});

describe('Sealed', () => {
  it('should resolve via when with matching key', () => {
    const instance = new TestSealed('active', 42);

    const result = instance.when({
      active: (value) => `active-${value}`,
      inactive: () => 'inactive'
    });

    expect(result).toBe('active-42');
  });

  it('should throw when resolver key is missing', () => {
    const instance = new TestSealed('missing', 42);

    expect(() => instance.when({})).toThrow(
      'Sealed class could not resolve call'
    );
  });

  it('should call otherwise callback', () => {
    const instance = new TestSealed('active', 42);
    const otherwise = vi.fn();

    instance.when({ active: (v: number) => v }, otherwise);

    expect(otherwise).toHaveBeenCalled();
  });
});
