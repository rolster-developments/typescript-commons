import { clone, setCloneStrategy, CloneStrategy } from './clone-helper';

describe('clone', () => {
  it('should return primitives as-is', () => {
    expect(clone(42)).toBe(42);
    expect(clone('hello')).toBe('hello');
    expect(clone(true)).toBe(true);
    expect(clone(null)).toBeNull();
    expect(clone(undefined)).toBeUndefined();
  });

  it('should deep clone a plain object', () => {
    const original = { a: 1, b: { c: 2, d: [3, 4] } };
    const cloned = clone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
    expect(cloned.b.d).not.toBe(original.b.d);
  });

  it('should deep clone an array', () => {
    const original = [1, [2, 3], { a: 4 }];
    const cloned = clone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned[1]).not.toBe(original[1]);
    expect(cloned[2]).not.toBe(original[2]);
  });

  it('should clone Date objects', () => {
    const original = new Date('2024-01-01');
    const cloned = clone(original);

    expect(cloned).toBeInstanceOf(Date);
    expect(cloned.getTime()).toBe(original.getTime());
    expect(cloned).not.toBe(original);
  });

  it('should clone RegExp objects', () => {
    const original = /test/gi;
    const cloned = clone(original);

    expect(cloned).toBeInstanceOf(RegExp);
    expect(cloned.source).toBe(original.source);
    expect(cloned.flags).toBe(original.flags);
    expect(cloned).not.toBe(original);
  });

  it('should handle circular references', () => {
    const original: any = { a: 1 };
    original.self = original;

    expect(() => clone(original)).not.toThrow();
    const cloned = clone(original);
    expect(cloned.a).toBe(1);
  });

  it('should apply overrides', () => {
    const original = { a: 1, b: 2, c: 3 };
    const cloned = clone(original, { b: 99 });

    expect(cloned.a).toBe(1);
    expect(cloned.b).toBe(99);
    expect(cloned.c).toBe(3);
  });

  it('should handle nested overrides', () => {
    const original = { a: { b: 1, c: 2 } };
    const cloned = clone(original, { a: { b: 10 } } as any);

    expect(cloned.a).toEqual({ b: 10 });
  });

  it('should use custom clone strategy', () => {
    const strategy: CloneStrategy = (_value, key) => key !== 'secret';
    setCloneStrategy(strategy);

    const original = { name: 'John', secret: 'hidden', age: 30 };
    const cloned = clone(original);

    expect(cloned.name).toBe('John');
    expect(cloned.age).toBe(30);
    expect((cloned as any).secret).toBeUndefined();

    setCloneStrategy(() => true);
  });
});
