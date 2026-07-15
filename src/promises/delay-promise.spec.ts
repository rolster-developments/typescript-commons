import { delayPromise } from './delay-promise';

describe('delayPromise', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve with the callback value after the delay', async () => {
    const promise = delayPromise(() => 42, 100);

    vi.advanceTimersByTime(100);

    await expect(promise).resolves.toBe(42);
  });

  it('should work with async callbacks', async () => {
    const promise = delayPromise(async () => 'hello', 200);

    vi.advanceTimersByTime(200);

    await expect(promise).resolves.toBe('hello');
  });

  it('should not resolve before the delay', () => {
    const callback = vi.fn(() => 'done');
    const promise = delayPromise(callback, 100);

    vi.advanceTimersByTime(50);

    expect(callback).not.toHaveBeenCalled();
  });
});
