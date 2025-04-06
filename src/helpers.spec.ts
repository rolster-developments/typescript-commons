import {
  callback,
  clone,
  evalValueOrFunction,
  freeze,
  itIsDefined,
  itIsUndefined,
  normalizeJson,
  parse,
  parseBoolean
} from './helpers';

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

describe('Helpers', () => {
  it('should execute test of "isDefined" successful', () => {
    expect(itIsDefined('Daniel')).toBe(true);
    expect(itIsDefined(24)).toBe(true);
    expect(itIsDefined(new Date())).toBe(true);
    expect(itIsDefined(undefined)).toBe(false);
    expect(itIsDefined(null)).toBe(false);
  });

  it('should execute test of "isUndefined" successful', () => {
    expect(itIsUndefined('Daniel')).toBe(false);
    expect(itIsUndefined(24)).toBe(false);
    expect(itIsUndefined(new Date())).toBe(false);
    expect(itIsUndefined(undefined)).toBe(true);
    expect(itIsUndefined(null)).toBe(true);
  });

  it('should execute test of "parseBoolean" successful', () => {
    expect(parseBoolean('Daniel')).toBe(true);
    expect(parseBoolean(24)).toBe(true);
    expect(parseBoolean(new Date())).toBe(true);
    expect(parseBoolean(true)).toBe(true);
    expect(parseBoolean(false)).toBe(false);
    expect(parseBoolean(null)).toBe(false);
    expect(parseBoolean(undefined)).toBe(false);
    expect(parseBoolean('false')).toBe(false);
    expect(parseBoolean(0)).toBe(false);
    expect(parseBoolean('undefined')).toBe(false);
    expect(parseBoolean('0')).toBe(false);
  });

  it('should execute test of "parse" successful', () => {
    const personString = JSON.stringify({
      firstName: 'Daniel',
      lastName: 'Castillo'
    });

    expect(parse('Katherin')).toBe('Katherin');
    expect(parse('24')).toBe(24);
    expect(parse('true')).toBe(true);
    expect(parse('false')).toBe(false);

    const person = parse<{ firstName: string; lastName: string }>(personString);

    expect(person).toBeDefined();
    expect(person.firstName).toBeDefined();
    expect(person.lastName).toBeDefined();
    expect(person.firstName).toBe('Daniel');
    expect(person.lastName).toBe('Castillo');
  });

  it('should execute test of "evalValueOrFunction" successful', () => {
    expect(evalValueOrFunction('Katherin')).toBe('Katherin');
    expect(evalValueOrFunction(30)).toBe(30);
    expect(evalValueOrFunction(() => 'Katherin')).toBe('Katherin');
    expect(evalValueOrFunction(() => 30)).toBe(30);
  });

  it('should execute test of "clone" with primitive successful', () => {
    let fullName = 'Daniel'; // Initial state

    expect(fullName).toBe('Daniel');

    const fullNameClone = clone(fullName);
    fullName = 'Daniel Castillo';

    expect(fullName).toBe('Daniel Castillo');
    expect(fullNameClone).toBe('Daniel');
  });

  it('should execute test of "clone" with Date successful', () => {
    const dateInitial = new Date(1991, 4, 3, 0, 0, 0);

    expect(dateInitial).toBeDefined();
    expect(dateInitial.getFullYear()).toBe(1991);

    const dateReference = dateInitial;

    expect(dateInitial).toEqual(dateReference);

    dateReference.setFullYear(1993);

    expect(dateInitial.getFullYear()).toBe(1993);
    expect(dateReference.getFullYear()).toBe(1993);

    const dateClone = clone(dateInitial);

    dateClone.setFullYear(1991);

    expect(dateInitial.getFullYear()).toBe(1993);
    expect(dateReference.getFullYear()).toBe(1993);
    expect(dateClone.getFullYear()).toBe(1991);
  });

  it('should execute test of "clone" with CustomClass successful', () => {
    const person1 = new Person('Katherin', 'Bolaño');

    expect(person1).toBeDefined();
    expect(person1.fullName).toBe('Katherin Bolaño');
    expect(person1.age).toBe(20);

    const person1C1 = clone(person1);

    expect(person1C1).toBeDefined();

    person1C1.setAge(30);

    expect(person1.age).toBe(20);
    expect(person1.fullName).toBe('Katherin Bolaño');
    expect(person1C1.age).toBe(30);
    expect(person1C1.fullName).toBe('Katherin Bolaño');

    const person1C2 = clone(person1, { occupation: 'Instrumentadora' });

    expect(person1C2).toBeDefined();

    expect(person1.occupation).toBe('None');
    expect(person1C2.age).toBe(20);
    expect(person1C2.fullName).toBe('Katherin Bolaño');
    expect(person1C2.occupation).toBe('Instrumentadora');

    const person2 = new Person('Daniel', 'Castillo');
    person2.setAge(16);

    expect(person2).toBeDefined();
    expect(person2.fullName).toBe('Daniel Castillo');
    expect(person2.age).toBe(16);
    expect(person2.isAdult).toBe(false);

    const person2C1 = clone(person2);

    expect(person2C1).toBeDefined();
    expect(person2C1.age).toBe(16);
    expect(person2C1.isAdult).toBe(false);

    const person2C2 = clone(person2, {}, /\b_\w+\b/);

    expect(person2C2).toBeDefined();
    expect(person2C2.age).toBe(20);
    expect(person2C2.isAdult).toBe(true);
  });

  it('should execute test of "freeze" successful', () => {
    const person = new Person('Daniel', 'Castillo');

    expect(person).toBeDefined();
    expect(Object.isFrozen(person)).toBe(false);
    expect(Object.isFrozen(person.lastName)).toBe(false);

    freeze(person);

    expect(person).toBeDefined();
    expect(Object.isFrozen(person)).toBe(true);
    expect(Object.isFrozen(person.lastName)).toBe(true);
  });

  it('should execute test of "callback" successful', () => {
    function multiply(a: number, b: number): number {
      return a * b;
    }

    expect(callback<number>(multiply, 5, 7)).toBe(35);
    expect(callback(undefined, 5, 7)).toBeUndefined();
  });

  it('should execute test of "normalizeJson" successful', () => {
    expect(normalizeJson({ nickname: 'Daniel' })).toEqual({
      nickname: 'Daniel'
    });

    expect(
      normalizeJson({
        nickname: 'Daniel',
        address: { city: 'Valledupar', country: undefined }
      })
    ).toEqual({
      nickname: 'Daniel',
      address: { city: 'Valledupar' }
    });

    expect(
      normalizeJson({
        nickname: 'Daniel',
        address: { city: 'Valledupar' },
        points: ['10', '20', '40']
      })
    ).toEqual({
      nickname: 'Daniel',
      address: { city: 'Valledupar' },
      points: ['10', '20', '40']
    });
  });
});
