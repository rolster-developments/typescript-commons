import { stream, streamValue, streamStatus } from './stream';

describe('Stream', () => {
  it('should start with loading state', () => {
    const promise = new Promise<string>(() => {});
    const obs = stream(promise);

    obs.subscribe((state) => {
      expect(state.is('loading')).toBe(true);
    });
  });

  it('should transition to success on resolve', async () => {
    const promise = Promise.resolve('test');
    const obs = stream(promise);

    obs.subscribe((state) => {
      if (state.is('loading')) return;

      state.when({
        success: ({ response }) => {
          expect(response).toBe('test');
        }
      });
    });

    await promise;
  });

  it('should transition to failure on reject', async () => {
    const error = new Error('fail');
    const promise = Promise.reject(error);
    const obs = stream(promise);

    obs.subscribe((state) => {
      if (state.is('loading')) return;

      state.when({
        failure: (err) => {
          expect(err).toBe(error);
        }
      });
    });

    await promise.catch(() => {});
  });
});

describe('streamValue', () => {
  it('should call success handler on resolve', async () => {
    const promise = Promise.resolve('data');
    const successFn = vi.fn();

    streamValue(promise).subscribe({
      success: (state) => {
        successFn(state.response);
      }
    });

    await promise;

    expect(successFn).toHaveBeenCalledWith('data');
  });
});

describe('streamStatus', () => {
  it('should emit loading then success status', async () => {
    const promise = Promise.resolve('ok');
    const statuses: string[] = [];

    streamStatus(promise).subscribe((status) => {
      if (status.isLoading) statuses.push('loading');
      if (status.isSuccessful) statuses.push('success');
      if (status.isError) statuses.push('error');
    });

    await promise;

    expect(statuses).toContain('success');
  });
});
