const falsyValue = ['false', 'undefined', '0', 0];

type Calleable<T> = Undefined<(...args: any) => T>;

export function valueIsDefined<T = any>(value: T): value is NonNullable<T> {
  return typeof value !== 'undefined' && value !== null;
}

export function valueIsUndefined(value: any): value is undefined | null {
  return !valueIsDefined(value);
}

export function parseBoolean(value: any): boolean {
  return !(
    valueIsUndefined(value) ||
    value === false ||
    falsyValue.includes(value)
  );
}

export function parse<T>(value: string): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
}

export function evalValueOrFunction<T>(value: ValueOrFunction<T>): T {
  return typeof value === 'function' ? (value as Function)() : value;
}

export function freeze<T>(value: T): Readonly<T> {
  if (typeof value !== 'object') {
    return value;
  }

  for (const key in value) {
    const item = value[key];

    if (typeof item === 'object' && !Object.isFrozen(item)) {
      freeze(item);
    }
  }

  return Object.freeze(value);
}

export function seal<O>(value: O): Readonly<O> {
  if (typeof value !== 'object') {
    return value;
  }

  for (const key in value) {
    const item = value[key];

    if (typeof item === 'object' && !Object.isSealed(item)) {
      seal(item);
    }
  }

  return Object.seal(value);
}

export function callback<T = any>(
  call: Calleable<T>,
  ...args: any
): Undefined<T> {
  return typeof call !== 'function' ? undefined : call.apply(call, args);
}

function normalizeValue(value: any): any {
  return typeof value === 'object'
    ? Array.isArray(value)
      ? value.map((value) => normalizeValue(value))
      : normalizeJson(value)
    : value;
}

export function normalizeJson(payload: LiteralObject): LiteralObject {
  return Object.entries(payload).reduce(
    (result: LiteralObject, [key, value]) => {
      if (valueIsDefined(value)) {
        result[key] = normalizeValue(value);
      }

      return result;
    },
    {}
  );
}
