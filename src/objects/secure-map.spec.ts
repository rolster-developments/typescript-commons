import { SecureMap } from './secure-map';

describe('SecureMap', () => {
  it('should create and return a default value for a missing key', () => {
    const map = new SecureMap<number>(() => 0);

    expect(map.request('a')).toBe(0);
  });

  it('should return existing value if key is already set', () => {
    const map = new SecureMap<number>(() => 0);

    map.set('a', 42);

    expect(map.request('a')).toBe(42);
  });

  it('should use the provided value when given', () => {
    const factory = vi.fn(() => 0);
    const map = new SecureMap<number>(factory);

    const result = map.request('a', 99);

    expect(result).toBe(99);
    expect(factory).not.toHaveBeenCalled();
  });

  it('should call factory only once for repeated requests', () => {
    const factory = vi.fn(() => Math.random());
    const map = new SecureMap<number>(factory);

    const first = map.request('a');
    const second = map.request('a');

    expect(first).toBe(second);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('should extend Map and support Map methods', () => {
    const map = new SecureMap<number>(() => 0);

    map.set('x', 10);
    map.set('y', 20);

    expect(map.has('x')).toBe(true);
    expect(map.get('y')).toBe(20);
    expect(map.size).toBe(2);
  });

  it('should handle non-string keys', () => {
    const map = new SecureMap<string, number>(() => 'default');

    map.set(1, 'one');

    expect(map.request(1)).toBe('one');
    expect(map.request(2)).toBe('default');
  });
});
