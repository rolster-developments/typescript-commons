import { securePromise } from './secure-promise';

describe('securePromise', () => {
  it('should call the callback and resolve', async () => {
    const callback = vi.fn(() => Promise.resolve(42));
    const sp = securePromise(callback);

    const result = await sp.resolve();

    expect(result).toBe(42);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cache the promise and not call callback twice', async () => {
    const callback = vi.fn(() => Promise.resolve(42));
    const sp = securePromise(callback);

    await sp.resolve();
    await sp.resolve();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should report isInstanced correctly', async () => {
    const sp = securePromise(() => Promise.resolve(42));

    expect(sp.isInstanced()).toBe(false);

    sp.resolve();

    expect(sp.isInstanced()).toBe(true);
  });

  it('should report isRequesting after resolve call', () => {
    const sp = securePromise(() => Promise.resolve(42));

    expect(sp.isRequesting()).toBe(false);

    sp.resolve();

    expect(sp.isRequesting()).toBe(true);
  });

  it('should reset the cached promise', async () => {
    let counter = 0;
    const callback = vi.fn(() => Promise.resolve(++counter));
    const sp = securePromise(callback);

    const first = await sp.resolve();
    expect(first).toBe(1);

    sp.reset();
    expect(sp.isInstanced()).toBe(false);

    const second = await sp.resolve();
    expect(second).toBe(2);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should refresh by clearing cache and resolving', async () => {
    let counter = 0;
    const callback = vi.fn(() => Promise.resolve(++counter));
    const sp = securePromise(callback);

    const first = await sp.resolve();
    expect(first).toBe(1);

    const second = await sp.refresh();
    expect(second).toBe(2);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should handle catchError and return fallback', async () => {
    const callback = vi.fn(() => Promise.reject(new Error('fail')));
    const catchError = vi.fn(() => 'fallback');
    const sp = securePromise(callback, catchError);

    const result = await sp.resolve();

    expect(result).toBe('fallback');
    expect(catchError).toHaveBeenCalled();
  });

  it('should reject when catchError returns undefined', async () => {
    const callback = vi.fn(() => Promise.reject(new Error('fail')));
    const catchError = vi.fn(() => undefined);
    const sp = securePromise(callback, catchError);

    await expect(sp.resolve()).rejects.toThrow('fail');
  });
});
