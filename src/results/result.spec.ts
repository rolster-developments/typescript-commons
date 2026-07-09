import { ResultFactory } from './result';

describe('ResultFactory', () => {
  it('should create a success result', () => {
    const result = ResultFactory.success(42);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe(42);
  });

  it('should create a failure result', () => {
    const result = ResultFactory.failure('error');

    expect(result.isSuccess).toBe(false);
    expect(result.value).toBe('error');
  });

  it('should freeze the result object', () => {
    const result = ResultFactory.success(42);

    expect(Object.isFrozen(result)).toBe(true);
  });

  it('should support type narrowing with isSuccess', () => {
    const success = ResultFactory.success('ok');
    const failure = ResultFactory.failure('fail');

    if (success.isSuccess) {
      expect(success.value).toBe('ok');
    }

    if (!failure.isSuccess) {
      expect(failure.value).toBe('fail');
    }
  });
});
