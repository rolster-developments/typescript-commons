import { Optional } from './optional';

describe('Optional', () => {
  describe('of', () => {
    it('should create a present optional', () => {
      const opt = Optional.of(42);

      expect(opt.isPresent()).toBe(true);
      expect(opt.isEmpty()).toBe(false);
      expect(opt.get()).toBe(42);
    });

    it('should throw for null or undefined', () => {
      expect(() => Optional.of(null as any)).toThrow();
      expect(() => Optional.of(undefined as any)).toThrow();
    });
  });

  describe('empty', () => {
    it('should create an empty optional', () => {
      const opt = Optional.empty();

      expect(opt.isPresent()).toBe(false);
      expect(opt.isEmpty()).toBe(true);
    });

    it('should throw on get', () => {
      const opt = Optional.empty();

      expect(() => opt.get()).toThrow('The optional is not present.');
    });
  });

  describe('build', () => {
    it('should create present for defined values', () => {
      const opt = Optional.build(42);

      expect(opt.isPresent()).toBe(true);
    });

    it('should create empty for null', () => {
      const opt = Optional.build(null);

      expect(opt.isEmpty()).toBe(true);
    });

    it('should create empty for undefined', () => {
      const opt = Optional.build(undefined);

      expect(opt.isEmpty()).toBe(true);
    });
  });

  describe('present', () => {
    it('should call callback when present', () => {
      const callback = vi.fn();
      const opt = Optional.of(42);

      opt.present(callback);

      expect(callback).toHaveBeenCalledWith(42);
    });

    it('should not call callback when empty', () => {
      const callback = vi.fn();
      const opt = Optional.empty();

      opt.present(callback);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('empty', () => {
    it('should call callback when empty', () => {
      const callback = vi.fn();
      const opt = Optional.empty();

      opt.empty(callback);

      expect(callback).toHaveBeenCalled();
    });

    it('should not call callback when present', () => {
      const callback = vi.fn();
      const opt = Optional.of(42);

      opt.empty(callback);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('when', () => {
    it('should call present handler when present', () => {
      const presentFn = vi.fn(() => 'present');
      const emptyFn = vi.fn(() => 'empty');
      const opt = Optional.of(42);

      const result = opt.when(presentFn, emptyFn);

      expect(result).toBe('present');
      expect(presentFn).toHaveBeenCalledWith(42);
      expect(emptyFn).not.toHaveBeenCalled();
    });

    it('should call empty handler when empty', () => {
      const presentFn = vi.fn(() => 'present');
      const emptyFn = vi.fn(() => 'empty');
      const opt = Optional.empty();

      const result = opt.when(presentFn, emptyFn);

      expect(result).toBe('empty');
      expect(presentFn).not.toHaveBeenCalled();
      expect(emptyFn).toHaveBeenCalled();
    });
  });
});
