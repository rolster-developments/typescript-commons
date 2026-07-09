import { fromPromise, rethrow, silence, unawaited } from './promise-helper';

describe('fromPromise', () => {
  it('should resolve with the value when given a non-Promise', async () => {
    await expect(fromPromise(42)).resolves.toBe(42);
  });

  it('should return the same Promise when given a Promise', async () => {
    const promise = Promise.resolve('hello');
    const result = fromPromise(promise);

    await expect(result).resolves.toBe('hello');
    expect(result).toBe(promise);
  });
});

describe('rethrow', () => {
  it('should resolve when the promise resolves', async () => {
    await expect(
      rethrow(Promise.resolve('ok'))
    ).resolves.toBeUndefined();
  });

  it('should call catchError and rethrow on rejection', async () => {
    const catchError = vi.fn();
    const error = new Error('test error');

    await expect(
      rethrow(Promise.reject(error), catchError)
    ).rejects.toThrow('test error');

    expect(catchError).toHaveBeenCalledWith(error);
  });

  it('should rethrow even without catchError', async () => {
    await expect(
      rethrow(Promise.reject(new Error('fail')))
    ).rejects.toThrow('fail');
  });
});

describe('silence', () => {
  it('should resolve when the promise resolves', async () => {
    await expect(
      silence(Promise.resolve('ok'))
    ).resolves.toBeUndefined();
  });

  it('should call catchError and return undefined on rejection', async () => {
    const catchError = vi.fn();
    const error = new Error('test error');

    const result = await silence(Promise.reject(error), catchError);

    expect(result).toBeUndefined();
    expect(catchError).toHaveBeenCalledWith(error);
  });
});

describe('unawaited', () => {
  it('should resolve with the value when promise resolves', async () => {
    const result = await unawaited(Promise.resolve(42));

    expect(result).toBe(42);
  });

  it('should return undefined on rejection', async () => {
    const catchError = vi.fn();
    const error = new Error('test error');

    const result = await unawaited(Promise.reject(error), catchError);

    expect(result).toBeUndefined();
    expect(catchError).toHaveBeenCalledWith(error);
  });
});
