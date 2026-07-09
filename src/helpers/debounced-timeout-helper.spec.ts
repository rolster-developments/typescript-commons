import { createDebouncedTimeout } from './debounced-timeout-helper';

describe('createDebouncedTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should execute the callback after the delay', () => {
    const callback = vi.fn();
    const debounced = createDebouncedTimeout(100);

    debounced.schedule(callback);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should debounce multiple calls', () => {
    const callback = vi.fn();
    const debounced = createDebouncedTimeout(100);

    debounced.schedule(callback);
    vi.advanceTimersByTime(50);

    debounced.schedule(callback);
    vi.advanceTimersByTime(50);

    expect(callback).not.toHaveBeenCalled();

    debounced.schedule(callback);
    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cancel a scheduled callback', () => {
    const callback = vi.fn();
    const debounced = createDebouncedTimeout(100);

    debounced.schedule(callback);
    debounced.cancel();

    vi.advanceTimersByTime(100);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should use custom delay when provided', () => {
    const callback = vi.fn();
    const debounced = createDebouncedTimeout(100);

    debounced.schedule(callback, 200);
    vi.advanceTimersByTime(100);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not throw when cancel is called without a scheduled timeout', () => {
    const debounced = createDebouncedTimeout(100);

    expect(() => debounced.cancel()).not.toThrow();
  });
});
