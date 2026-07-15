import { Queque } from './queque';

describe('Queque', () => {
  it('should enqueue and dequeue in FIFO order', () => {
    const queque = new Queque<number>();

    queque.enqueue(1);
    queque.enqueue(2);
    queque.enqueue(3);

    expect(queque.dequeue()).toBe(1);
    expect(queque.dequeue()).toBe(2);
    expect(queque.dequeue()).toBe(3);
  });

  it('should track length', () => {
    const queque = new Queque<number>();

    expect(queque.length).toBe(0);

    queque.enqueue(1);
    expect(queque.length).toBe(1);

    queque.enqueue(2);
    expect(queque.length).toBe(2);

    queque.dequeue();
    expect(queque.length).toBe(1);

    queque.dequeue();
    expect(queque.length).toBe(0);
  });

  it('should return undefined when dequeuing an empty queque', () => {
    const queque = new Queque<number>();

    expect(queque.dequeue()).toBeUndefined();
  });

  it('should handle single element', () => {
    const queque = new Queque<number>();

    queque.enqueue(42);
    expect(queque.dequeue()).toBe(42);
    expect(queque.dequeue()).toBeUndefined();
  });

  it('should create from array', () => {
    const queque = Queque.fromArray([1, 2, 3]);

    expect(queque.length).toBe(3);
    expect(queque.dequeue()).toBe(1);
    expect(queque.dequeue()).toBe(2);
    expect(queque.dequeue()).toBe(3);
  });

  it('should create mapped queque', () => {
    const queque = Queque.map([1, 2, 3], (n) => n * 2);

    expect(queque.length).toBe(3);
    expect(queque.dequeue()).toBe(2);
    expect(queque.dequeue()).toBe(4);
    expect(queque.dequeue()).toBe(6);
  });
});
