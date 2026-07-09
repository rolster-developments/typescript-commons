import { Criteria, Criterias } from './criteria';

describe('Criteria', () => {
  it('should create a criteria with key and value', () => {
    const criteria = new Criteria('name', 'John');

    expect(criteria.key).toBe('name');
    expect(criteria.value).toBe('John');
  });

  it('should call assign callback', () => {
    const criteria = new Criteria('age', 30);
    const callback = vi.fn();

    criteria.assign(callback);

    expect(callback).toHaveBeenCalledWith('age', 30);
  });

  it('should check equality', () => {
    const criteria = new Criteria('active', true);

    expect(criteria.equals(true)).toBe(true);
    expect(criteria.equals(false)).toBe(false);
  });
});

describe('Criterias', () => {
  it('should append a criteria by key and value', () => {
    const criterias = new Criterias();

    criterias.append('name', 'John');

    expect(criterias.value('name')).toBe('John');
  });

  it('should append a Criteria object', () => {
    const criterias = new Criterias();
    const criteria = new Criteria('age', 30);

    criterias.append(criteria);

    expect(criterias.value('age')).toBe(30);
  });

  it('should return undefined for non-existent key', () => {
    const criterias = new Criterias();

    expect(criterias.value('nonexistent')).toBeUndefined();
  });

  it('should be chainable', () => {
    const criterias = new Criterias<{ a: number; b: number; c: number }>();

    const result = criterias.append('a', 1).append('b', 2).append('c', 3);

    expect(result).toBe(criterias);
    expect(criterias.value('a')).toBe(1);
    expect(criterias.value('b')).toBe(2);
    expect(criterias.value('c')).toBe(3);
  });

  it('should compare equality correctly', () => {
    const a = new Criterias();
    a.append('name', 'John').append('age', 30);

    const b = new Criterias();
    b.append('name', 'John').append('age', 30);

    expect(a.equals(b)).toBe(true);
  });

  it('should detect inequality', () => {
    const a = new Criterias();
    a.append('name', 'John');

    const b = new Criterias();
    b.append('name', 'Jane');

    expect(a.equals(b)).toBe(false);
  });

  it('should detect size mismatch', () => {
    const a = new Criterias();
    a.append('name', 'John');

    const b = new Criterias();
    b.append('name', 'John').append('age', 30);

    expect(a.equals(b)).toBe(false);
  });

  it('should convert to literal object', () => {
    const criterias = new Criterias();
    criterias.append('name', 'John').append('age', 30);

    expect(criterias.toLiteralObject()).toEqual({ name: 'John', age: 30 });
  });

  it('should create from literal object', () => {
    const criterias = Criterias.fromLiteralObject({
      name: 'John',
      age: 30
    });

    expect(criterias.value('name')).toBe('John');
    expect(criterias.value('age')).toBe(30);
  });
});
