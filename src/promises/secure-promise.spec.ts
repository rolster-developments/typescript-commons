import { securePromise, securePromiseOfValue } from './secure-promise';

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

  it('should report isResolved only after the promise is fulfilled', async () => {
    let resolveCallback: (value: number) => void = () => {};

    const sp = securePromise(
      () => new Promise<number>((resolve) => (resolveCallback = resolve))
    );

    expect(sp.isResolved()).toBe(false);

    const promise = sp.resolve();

    expect(sp.isInstanced()).toBe(true);
    expect(sp.isResolved()).toBe(false);

    resolveCallback(42);
    await promise;

    expect(sp.isResolved()).toBe(true);
    expect(sp.isRequesting()).toBe(false);
  });

  it('should report isResolved as false after reset', async () => {
    const sp = securePromise(() => Promise.resolve(42));

    await sp.resolve();
    expect(sp.isResolved()).toBe(true);

    sp.reset();
    expect(sp.isResolved()).toBe(false);
  });

  it('should report isResolved as false while refreshing', async () => {
    const sp = securePromise(() => Promise.resolve(42));

    await sp.resolve();
    expect(sp.isResolved()).toBe(true);

    const promise = sp.refresh();
    expect(sp.isResolved()).toBe(false);

    await promise;
    expect(sp.isResolved()).toBe(true);
  });

  it('should report isError when promise is rejected', async () => {
    const sp = securePromise(() => Promise.reject(new Error('fail')));

    expect(sp.isError()).toBe(false);

    await expect(sp.resolve()).rejects.toThrow('fail');

    expect(sp.isError()).toBe(true);
    expect(sp.isResolved()).toBe(false);
  });

  it('should report isError when catchError returns fallback', async () => {
    const sp = securePromise(
      () => Promise.reject(new Error('fail')),
      () => 'fallback'
    );

    await expect(sp.resolve()).resolves.toBe('fallback');

    expect(sp.isError()).toBe(true);
    expect(sp.isResolved()).toBe(false);
  });

  it('should report isError as false after reset', async () => {
    const sp = securePromise(() => Promise.reject(new Error('fail')));

    await expect(sp.resolve()).rejects.toThrow('fail');
    expect(sp.isError()).toBe(true);

    sp.reset();
    expect(sp.isError()).toBe(false);
  });

  it('should clear isError when a new attempt starts', async () => {
    let failing = true;

    const sp = securePromise(() =>
      failing ? Promise.reject(new Error('fail')) : Promise.resolve(42)
    );

    await expect(sp.resolve()).rejects.toThrow('fail');
    expect(sp.isError()).toBe(true);

    failing = false;

    await expect(sp.resolve()).resolves.toBe(42);

    expect(sp.isError()).toBe(false);
    expect(sp.isResolved()).toBe(true);
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

describe('securePromiseOfValue', () => {
  it('should resolve with the given value', async () => {
    const sp = securePromiseOfValue(42);

    const result = await sp.resolve();

    expect(result).toBe(42);
  });

  it('should resolve with an object value', async () => {
    const value = { foo: 'bar' };
    const sp = securePromiseOfValue(value);

    const result = await sp.resolve();

    expect(result).toBe(value);
  });

  it('should resolve with undefined', async () => {
    const sp = securePromiseOfValue(undefined);

    const result = await sp.resolve();

    expect(result).toBeUndefined();
  });

  it('should cache the promise', async () => {
    const sp = securePromiseOfValue({});

    const first = sp.resolve();
    const second = sp.resolve();

    expect(first).toBe(second);
  });

  it('should report isInstanced correctly', () => {
    const sp = securePromiseOfValue(42);

    expect(sp.isInstanced()).toBe(false);

    sp.resolve();

    expect(sp.isInstanced()).toBe(true);
  });

  it('should report isRequesting after resolve call', () => {
    const sp = securePromiseOfValue(42);

    expect(sp.isRequesting()).toBe(false);

    sp.resolve();

    expect(sp.isRequesting()).toBe(true);
  });

  it('should report isRequesting as false after resolution', async () => {
    const sp = securePromiseOfValue(42);

    await sp.resolve();

    expect(sp.isRequesting()).toBe(false);
  });

  it('should reset the cached promise', async () => {
    const sp = securePromiseOfValue(42);

    const promiseA = sp.resolve();
    expect(sp.isInstanced()).toBe(true);

    sp.reset();
    expect(sp.isInstanced()).toBe(false);

    const promiseB = sp.resolve();
    expect(promiseA).not.toBe(promiseB);
  });

  it('should refresh by clearing cache and resolving', async () => {
    const sp = securePromiseOfValue(42);

    const promiseA = sp.resolve();

    const promiseB = sp.refresh();

    expect(promiseA).not.toBe(promiseB);
    await expect(promiseB).resolves.toBe(42);
  });
});
