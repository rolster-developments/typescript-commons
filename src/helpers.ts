const primitives = [Date, RegExp, Set, Map, Function, String, Boolean, Number];

const sliceSize = 512;

const falsyValue = ['false', 'undefined', '0', 0];

type Calleable<T> = Undefined<(...args: any) => T>;

export type CloneOverride<T> = Partial<{ [K in keyof T]: T[K] }>;

export type CloneStrategy<T = any> = (value: T, key: string) => boolean;

let _cloneStrategy: CloneStrategy = () => true;

function _clone<T>(
  value: T,
  caches: unknown[],
  overrides?: CloneOverride<T>
): T {
  if (itIsUndefined(value) || typeof value !== 'object') {
    return value;
  }

  if (Object.prototype.toString.call(value) === '[object Object]') {
    const [object] = caches.filter((_object) => _object === value);

    /* istanbul ignore if */
    if (object) {
      return object as T;
    }

    caches.push(value);
  }

  const ConstructorObject = Object.getPrototypeOf(value).constructor;

  if (primitives.includes(ConstructorObject)) {
    return new ConstructorObject(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => _clone(item, caches, {})) as T;
  }

  const object: T = new ConstructorObject();
  const keys = Object.keys(overrides ?? {});

  for (const key in value) {
    if (_cloneStrategy(value, key)) {
      if (overrides) {
        object[key] = keys.includes(key)
          ? (overrides[key] as any)
          : _clone(value[key], caches, {});
      } else {
        object[key] = _clone(value[key], caches, {});
      }
    }
  }

  return object;
}

export function setCloneStrategy(cloneStrategy: CloneStrategy): void {
  _cloneStrategy = cloneStrategy;
}

export function itIsDefined<T = any>(value: T): value is NonNullable<T> {
  return typeof value !== 'undefined' && value !== null;
}

export function itIsUndefined(value: any): value is undefined | null {
  return !itIsDefined(value);
}

export function parseBoolean(value: any): boolean {
  return !(
    itIsUndefined(value) ||
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

export function clone<T>(value: T, overrides?: CloneOverride<T>): T {
  return _clone(value, [], overrides);
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
      if (itIsDefined(value)) {
        result[key] = normalizeValue(value);
      }

      return result;
    },
    {}
  );
}

/* istanbul ignore next */
export function base64ToBlob(data64: string, mimeType: string): Blob {
  const result64 = data64.replace(/^[^,]+,/, '').replace(/\s/g, '');

  const byteCharacters = window.atob(result64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
}

export function ceilDecimals(number: number, size: number): number {
  const factor = Math.pow(10, size);

  return Math.ceil(number * factor) / factor;
}

export function floorDecimals(number: number, size: number): number {
  const factor = Math.pow(10, size);

  return Math.floor(number * factor) / factor;
}
