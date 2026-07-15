import { SealedPartial, Sealed } from './sealed';

describe('SealedPartial', () => {
  it('should check state with is()', () => {
    const instance = new SealedPartial('active', 42);

    expect(instance.is('active')).toBe(true);
    expect(instance.is('inactive')).toBe(false);
  });

  it('should resolve via when with matching key', () => {
    const instance = new SealedPartial('active', 42);

    const result = instance.when({
      active: (value) => `active-${value}`,
      inactive: () => 'inactive'
    });

    expect(result).toBe('active-42');
  });

  it('should return undefined when resolver key is missing', () => {
    const instance = new SealedPartial('active', 42);

    const result = instance.when({});

    expect(result).toBeUndefined();
  });

  it('should call otherwise callback', () => {
    const instance = new SealedPartial('active', 42);
    const otherwise = vi.fn();

    instance.when({}, otherwise);

    expect(otherwise).toHaveBeenCalled();
  });

  it('should call otherwise from instance method', () => {
    const instance = new SealedPartial('active', 42);
    const otherwise = vi.fn();

    instance.otherwise(otherwise).when({});

    expect(otherwise).toHaveBeenCalled();
  });
});

describe('Sealed', () => {
  it('should resolve via when with matching key', () => {
    const instance = new Sealed('active', 42);

    const result = instance.when({
      active: (value) => `active-${value}`,
      inactive: () => 'inactive'
    });

    expect(result).toBe('active-42');
  });

  it('should throw when resolver key is missing', () => {
    const instance = new Sealed('missing', 42);

    expect(() => instance.when({})).toThrow(
      'Sealed class could not resolve call'
    );
  });

  it('should call otherwise callback', () => {
    const instance = new Sealed('active', 42);
    const otherwise = vi.fn();

    instance.when({ active: (v: number) => v }, otherwise);

    expect(otherwise).toHaveBeenCalled();
  });
});
