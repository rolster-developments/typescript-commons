import { zipPromise } from './zip-promise';

describe('zipPromise', () => {
  it('should execute promises sequentially and return results', async () => {
    const results = await zipPromise([
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3)
    ]);

    expect(results).toEqual([1, 2, 3]);
  });

  it('should execute in order', async () => {
    const order: number[] = [];

    await zipPromise([
      () => {
        order.push(1);
        return Promise.resolve('a');
      },
      () => {
        order.push(2);
        return Promise.resolve('b');
      },
      () => {
        order.push(3);
        return Promise.resolve('c');
      }
    ]);

    expect(order).toEqual([1, 2, 3]);
  });

  it('should throw on error by default', async () => {
    await expect(
      zipPromise([
        () => Promise.resolve('ok'),
        () => Promise.reject(new Error('fail'))
      ])
    ).rejects.toThrow('fail');
  });

  it('should continue on error when option is set', async () => {
    const results = await zipPromise(
      [
        () => Promise.resolve(1),
        () => Promise.reject(new Error('fail')),
        () => Promise.resolve(3)
      ],
      { continueOnError: true }
    );

    expect(results).toEqual([1, undefined, 3]);
  });

  it('should use custom errorValue when continueOnError', async () => {
    const results = await zipPromise(
      [
        () => Promise.resolve('a'),
        () => Promise.reject(new Error('fail'))
      ],
      { continueOnError: true, errorValue: 'fallback' }
    );

    expect(results).toEqual(['a', 'fallback']);
  });
});
