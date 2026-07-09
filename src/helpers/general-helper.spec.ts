import {
  valueIsDefined,
  valueIsUndefined,
  parseBoolean,
  parse,
  evalValueOrFunction,
  freeze,
  seal,
  callback,
  normalizeJson
} from './general-helper';

describe('valueIsDefined', () => {
  it('should return true for defined values', () => {
    expect(valueIsDefined(0)).toBe(true);
    expect(valueIsDefined('')).toBe(true);
    expect(valueIsDefined(false)).toBe(true);
    expect(valueIsDefined({})).toBe(true);
    expect(valueIsDefined([])).toBe(true);
  });

  it('should return false for null or undefined', () => {
    expect(valueIsDefined(null)).toBe(false);
    expect(valueIsDefined(undefined)).toBe(false);
  });
});

describe('valueIsUndefined', () => {
  it('should return true for null or undefined', () => {
    expect(valueIsUndefined(null)).toBe(true);
    expect(valueIsUndefined(undefined)).toBe(true);
  });

  it('should return false for defined values', () => {
    expect(valueIsUndefined(0)).toBe(false);
    expect(valueIsUndefined('')).toBe(false);
  });
});

describe('parseBoolean', () => {
  it('should return true for truthy values', () => {
    expect(parseBoolean(true)).toBe(true);
    expect(parseBoolean('true')).toBe(true);
    expect(parseBoolean(1)).toBe(true);
    expect(parseBoolean({})).toBe(true);
    expect(parseBoolean([])).toBe(true);
  });

  it('should return false for falsy values', () => {
    expect(parseBoolean(false)).toBe(false);
    expect(parseBoolean(null)).toBe(false);
    expect(parseBoolean(undefined)).toBe(false);
    expect(parseBoolean('false')).toBe(false);
    expect(parseBoolean('undefined')).toBe(false);
    expect(parseBoolean('0')).toBe(false);
    expect(parseBoolean(0)).toBe(false);
  });
});

describe('parse', () => {
  it('should parse valid JSON', () => {
    expect(parse<{ a: number }>('{"a":1}')).toEqual({ a: 1 });
    expect(parse<number[]>('[1,2,3]')).toEqual([1, 2, 3]);
  });

  it('should return the string when JSON is invalid', () => {
    const result = parse('not-json');
    expect(result).toBe('not-json');
  });
});

describe('evalValueOrFunction', () => {
  it('should return the value directly', () => {
    expect(evalValueOrFunction(42)).toBe(42);
  });

  it('should call the function and return its result', () => {
    expect(evalValueOrFunction(() => 42)).toBe(42);
  });
});

describe('freeze', () => {
  it('should return primitives unchanged', () => {
    expect(freeze(42)).toBe(42);
    expect(freeze('hello')).toBe('hello');
  });

  it('should deep freeze an object', () => {
    const obj = freeze({ a: 1, b: { c: 2 } });

    expect(Object.isFrozen(obj)).toBe(true);
    expect(Object.isFrozen(obj.b)).toBe(true);
  });
});

describe('seal', () => {
  it('should return primitives unchanged', () => {
    expect(seal(42)).toBe(42);
  });

  it('should deep seal an object', () => {
    const obj = seal({ a: 1, b: { c: 2 } });

    expect(Object.isSealed(obj)).toBe(true);
    expect(Object.isSealed(obj.b)).toBe(true);
  });
});

describe('callback', () => {
  it('should call the function with arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const result = callback(fn, 3, 4);

    expect(fn).toHaveBeenCalledWith(3, 4);
    expect(result).toBe(7);
  });

  it('should return undefined for non-function', () => {
    expect(callback(undefined)).toBeUndefined();
    expect(callback(null as any)).toBeUndefined();
  });
});

describe('normalizeJson', () => {
  it('should remove undefined and null values', () => {
    const result = normalizeJson({
      a: 1,
      b: null,
      c: undefined,
      d: 'hello'
    });

    expect(result).toEqual({ a: 1, d: 'hello' });
    expect('b' in result).toBe(false);
    expect('c' in result).toBe(false);
  });

  it('should handle nested objects', () => {
    const result = normalizeJson({
      a: { b: 1, c: null },
      d: [1, null, 2]
    });

    expect(result).toEqual({
      a: { b: 1 },
      d: [1, null, 2]
    });
  });

  it('should handle empty object', () => {
    expect(normalizeJson({})).toEqual({});
  });
});
