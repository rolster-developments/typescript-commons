import {
  catchPromise,
  fromPromise,
  securePromise,
  resolvePromise,
  voidPromise,
  zipPromise
} from './promises';

describe('Promises', () => {
  it('should execute test of "fromPromise" successful', async () => {
    expect(await fromPromise(Promise.resolve(20))).toBe(20);
    expect(await fromPromise(20)).toBe(20);
  });

  it('should execute test of "zipPromise" successful', async () => {
    const result = await zipPromise<any>([
      () => Promise.resolve(20),
      () => Promise.resolve('Daniel'),
      () => Promise.resolve(true)
    ]);

    const [age, name, status] = result;

    expect(result).toBeDefined();
    expect(age).toBe(20);
    expect(name).toBe('Daniel');
    expect(status).toBe(true);

    const resultEmpty = await zipPromise([]);

    expect(resultEmpty).toBeDefined();
    expect(resultEmpty.length).toBe(0);

    await zipPromise<any>([
      () => Promise.resolve(20),
      () => Promise.resolve('Daniel'),
      () => Promise.reject('Error')
    ]).catch((err) => {
      expect(err).toBe('Error');
    });
  });

  it('should execute test of "thenPromise" successful', async () => {
    expect(await resolvePromise(Promise.resolve(20))).toBe(undefined);

    expect(await resolvePromise(Promise.reject('Error')).catch((err) => err)).toBe(
      'Error'
    );
  });

  it('should execute test of "voidPromise" successful', async () => {
    expect(await voidPromise(Promise.resolve(20))).toBe(undefined);
    expect(await voidPromise(Promise.reject('Error'))).toBe(undefined);
  });

  it('should execute test of "catchPromise" successful', async () => {
    expect(await catchPromise(Promise.resolve(20))).toBe(20);
    expect(await catchPromise(Promise.reject('Error'))).toBe(undefined);
  });

  it('should execute test of "securePromise" successful', async () => {
    let value: number = 20;
    let counter = 1;

    const callback = jest.fn();

    callback.mockImplementation(() => {
      if (counter < 3) {
        counter++;
        return Promise.resolve(value);
      } else {
        counter = 1;
        return Promise.reject(new Error('Error in callback'));
      }
    });

    const number$ = securePromise(callback);

    expect(await number$.resolve()).toBe(20);
    expect(callback).toHaveBeenCalledTimes(1);

    value = 40;

    expect(await number$.resolve()).toBe(20);
    expect(callback).toHaveBeenCalledTimes(1);

    number$.reset();

    expect(await number$.resolve()).toBe(40);
    expect(callback).toHaveBeenCalledTimes(2);

    number$.reset();

    expect(await number$.resolve().catch(() => undefined)).toBeUndefined();
    expect(callback).toHaveBeenCalledTimes(3);
  });
});
