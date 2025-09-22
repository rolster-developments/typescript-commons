import { valueIsUndefined } from './general-helper';

const primitives = [Date, RegExp, Set, Map, Function, String, Boolean, Number];

export type CloneOverride<T> = Partial<{ [K in keyof T]: T[K] }>;

export type CloneStrategy<T = any> = (value: T, key: string) => boolean;

let _cloneStrategy: CloneStrategy = () => true;

function _clone<T>(
  value: T,
  caches: unknown[],
  overrides?: CloneOverride<T>
): T {
  if (valueIsUndefined(value) || typeof value !== 'object') {
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

export function clone<T>(value: T, overrides?: CloneOverride<T>): T {
  return _clone(value, [], overrides);
}
