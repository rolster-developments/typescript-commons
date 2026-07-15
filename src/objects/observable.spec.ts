import { observable, Observable } from './observable';

describe('observable', () => {
  it('should create an observable with initial value', () => {
    const obs = observable(42);

    expect(obs.value).toBe(42);
  });

  it('should create an observable without initial value', () => {
    const obs = observable<number>();

    expect(obs.value).toBeUndefined();
  });

  it('should notify subscribers on subscribe with current value', () => {
    const obs = observable('hello');
    const observer = vi.fn();

    obs.subscribe(observer);

    expect(observer).toHaveBeenCalledWith('hello');
  });

  it('should notify subscribers on next', () => {
    const obs = observable('hello');
    const observer = vi.fn();

    obs.subscribe(observer);
    obs.next('world');

    expect(observer).toHaveBeenCalledWith('world');
  });

  it('should not notify listen subscribers with initial value', () => {
    const obs = observable('hello');
    const observer = vi.fn();

    obs.listen(observer);

    expect(observer).not.toHaveBeenCalled();
  });

  it('should notify listen subscribers on next', () => {
    const obs = observable('hello');
    const observer = vi.fn();

    obs.listen(observer);
    obs.next('world');

    expect(observer).toHaveBeenCalledWith('world');
  });

  it('should support unsubscribe', () => {
    const obs = observable('hello');
    const observer = vi.fn();

    const unsubscribe = obs.subscribe(observer);
    unsubscribe();

    obs.next('world');

    expect(observer).toHaveBeenCalledTimes(1);
  });

  it('should stop notifying after close', () => {
    const obs = observable('hello');
    const observer = vi.fn();

    obs.subscribe(observer);
    obs.close();
    obs.next('world');

    expect(observer).toHaveBeenCalledTimes(1);
  });

  it('should freeze the value', () => {
    const obs = observable({ a: 1, b: { c: 2 } });

    expect(Object.isFrozen(obs.value)).toBe(true);
    expect(Object.isFrozen((obs.value as any).b)).toBe(true);
  });
});
