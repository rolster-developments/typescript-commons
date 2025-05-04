import { observable } from './observable';

class LastName {
  constructor(public readonly value: string) {}
}

class Person {
  public readonly occupation: string = 'None';

  private _age = 20;

  public readonly lastName: LastName;

  private _isAdult?: boolean;

  constructor(
    public readonly firstName: string,
    lastName: string
  ) {
    this.lastName = new LastName(lastName);
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName.value}`;
  }

  public get age(): number {
    return this._age;
  }

  public get isAdult(): boolean {
    if (!this._isAdult) {
      this._isAdult = this._age >= 18;
    }

    return this._isAdult;
  }

  public setAge(age: number): void {
    this._age = age;
  }
}

describe('Observable', () => {
  it('should create observable', () => {
    const observable$ = observable(50);
    expect(observable$).toBeDefined();
  });

  it('should subscribe changes of observable', (done) => {
    const observable$ = observable(50);
    let index = 0;

    const values = [50, 20, 30];

    const unsubscription = observable$.subscribe((value) => {
      expect(value).toBe(values[index]);

      if (value === 30) {
        unsubscription();
        done();
      }

      index++; // Next value position
    });

    observable$.next(20);
    observable$.next(30);
  });

  it('should listen changes of observable', (done) => {
    const observable$ = observable(50);
    let index = 0;

    const values = [20, 30];

    const unsubscription = observable$.listen((value) => {
      expect(value).toBe(values[index]);

      if (value === 30) {
        unsubscription();
        done();
      }

      index++; // Next value position
    });

    observable$.next(20);
    observable$.next(30);
  });

  it('should subscribe changes of observable Person', (done) => {
    const daniel = new Person('Daniel', 'Castillo');
    const katherin = new Person('Katherin', 'Narvaez');
    katherin.setAge(25);

    const observable$ = observable(daniel);
    let index = 0;

    const unsubscription = observable$.subscribe((value) => {
      if (index === 0) {
        expect(value).toBe(daniel);
        expect(value.age).toBe(20);
        index++; // Next value position
      } else {
        expect(value).toBe(katherin);
        expect(value.age).toBe(25);
        unsubscription();
        done();
      }
    });

    observable$.next(katherin);
  });
});
