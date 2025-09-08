class QuequeElement<T> {
  private element?: QuequeElement<T>;

  constructor(public readonly value: T) {}

  public set next(element: Undefined<QuequeElement<T>>) {
    this.element = element;
  }

  public get next(): Undefined<QuequeElement<T>> {
    return this.element;
  }
}

export class Queque<T> {
  private head?: QuequeElement<T>;

  private tail?: QuequeElement<T>;

  private _length = 0;

  public get length(): number {
    return this._length;
  }

  public enqueue(value: T): void {
    const element = new QuequeElement(value);

    if (!this.head) {
      this.head = element;
    } else if (this.tail) {
      this.tail.next = element;
    }

    this.tail = element;

    this._length++;
  }

  public dequeue(): Undefined<T> {
    if (!this.head) {
      return undefined;
    }

    const head = this.head;

    this.head = head.next;

    this._length--;

    return head.value;
  }

  public static fromArray<T>(collection: T[]): Queque<T> {
    const queque = new Queque<T>();

    collection.forEach((element) => {
      queque.enqueue(element);
    });

    return queque;
  }

  public static map<T, V>(collection: T[], map: (element: T) => V): Queque<V> {
    const queque = new Queque<V>();

    collection.map((element) => queque.enqueue(map(element)));

    return queque;
  }
}
