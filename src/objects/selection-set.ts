export type SelectionEquals<T> = (value: T, element: T) => boolean;

function equalsByValue<T>(value: T, element: T): boolean {
  return value === element;
}

export class SelectionSet<T> {
  constructor(
    public readonly values: T[] = [],
    private readonly equals: SelectionEquals<T> = equalsByValue
  ) {}

  public get size(): number {
    return this.values.length;
  }

  public get isEmpty(): boolean {
    return this.values.length === 0;
  }

  public contains(value: T): boolean {
    return this.includes(this.values, value);
  }

  public containsAll(values: T[]): boolean {
    return !!values.length && values.every((value) => this.contains(value));
  }

  public containsAny(values: T[]): boolean {
    return values.some((value) => this.contains(value));
  }

  public select(value: T): SelectionSet<T> {
    return this.contains(value) ? this : this.clone([...this.values, value]);
  }

  public unselect(value: T): SelectionSet<T> {
    return this.contains(value)
      ? this.clone(this.exclude(this.values, [value]))
      : this;
  }

  public toggle(value: T): SelectionSet<T> {
    return this.contains(value) ? this.unselect(value) : this.select(value);
  }

  public toggleAll(values: T[]): SelectionSet<T> {
    const pendings = values.filter((value) => !this.contains(value));

    if (pendings.length) {
      return this.clone([...this.values, ...pendings]);
    }

    return values.length ? this.clone(this.exclude(this.values, values)) : this;
  }

  public refresh(values: T[]): SelectionSet<T> {
    const selecteds = this.values.filter((value) =>
      this.includes(values, value)
    );

    return selecteds.length === this.size ? this : this.clone(selecteds);
  }

  public clear(): SelectionSet<T> {
    return this.isEmpty ? this : this.clone([]);
  }

  private clone(values: T[]): SelectionSet<T> {
    return new SelectionSet(values, this.equals);
  }

  private includes(values: T[], value: T): boolean {
    return values.some((element) => this.equals(value, element));
  }

  private exclude(values: T[], excludes: T[]): T[] {
    return values.filter((value) => !this.includes(excludes, value));
  }
}
