import { Either } from './either';

describe('Either', () => {
  it('should create a success state', () => {
    const either = Either.success(42);

    expect(either.is('success')).toBe(true);
    expect(either.is('failure')).toBe(false);
  });

  it('should create a failure state', () => {
    const either = Either.failure('error');

    expect(either.is('failure')).toBe(true);
    expect(either.is('success')).toBe(false);
  });

  it('should handle success via when', () => {
    const either = Either.success('data');
    const successFn = vi.fn();
    const failureFn = vi.fn();

    either.when({
      success: (value) => successFn(value),
      failure: (value) => failureFn(value)
    });

    expect(successFn).toHaveBeenCalledWith('data');
    expect(failureFn).not.toHaveBeenCalled();
  });

  it('should handle failure via when', () => {
    const either = Either.failure('error');
    const successFn = vi.fn();
    const failureFn = vi.fn();

    either.when({
      success: (value) => successFn(value),
      failure: (value) => failureFn(value)
    });

    expect(successFn).not.toHaveBeenCalled();
    expect(failureFn).toHaveBeenCalledWith('error');
  });

  it('should return undefined if resolver key is missing (SealedPartial)', () => {
    const either = Either.success(42);

    const result = either.when({});

    expect(result).toBeUndefined();
  });
});
