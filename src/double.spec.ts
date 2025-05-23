import { Double } from './double';

describe('Double', () => {
  it('should create object successful', () => {
    const zero = Double.zero();

    expect(zero).toBeDefined();
    expect(zero.base).toBe(0);
    expect(zero.numbers).toEqual([0]);
    expect(zero.signed).toBe(0);

    const number1 = Double.create('10');

    expect(number1).toBeDefined();
    expect(number1.base).toBe(0);
    expect(number1.numbers).toEqual([10]);
    expect(number1.signed).toBe(1);

    const number2 = Double.create('-100');

    expect(number2).toBeDefined();
    expect(number2.base).toBe(0);
    expect(number2.numbers).toEqual([100]);
    expect(number2.signed).toBe(-1);

    const number3 = Double.create(265896214.12);

    expect(number3).toBeDefined();
    expect(number3.base).toBe(1);
    expect(number3.numbers).toEqual([2658, 96214, 12000]);
    expect(number3.signed).toBe(1);
  });

  it('should round floor successful', () => {
    const double1 = Double.create(20551055546.75675562321);

    expect(double1.numbers).toEqual([2, 5510, 55546, 75675, 60000]);
    expect(double1.base).toBe(2);
    expect(double1.signed).toBe(1);

    const floor1 = double1.roundFloor();

    expect(floor1.numbers).toEqual([2, 5510, 55546]);
    expect(floor1.base).toBe(2);
    expect(floor1.signed).toBe(1);

    const floor2 = double1.roundFloor(2);

    expect(floor2.numbers).toEqual([2, 5510, 55546, 75000]);
    expect(floor2.base).toBe(2);
    expect(floor2.signed).toBe(1);
  });

  it('should round ceil successful', () => {
    const double1 = Double.create(20551055546.75675562321);

    expect(double1.numbers).toEqual([2, 5510, 55546, 75675, 60000]);
    expect(double1.base).toBe(2);
    expect(double1.signed).toBe(1);

    const ceil1 = double1.roundCeil();

    expect(ceil1.numbers).toEqual([2, 5510, 55547]);
    expect(ceil1.base).toBe(2);
    expect(ceil1.signed).toBe(1);

    const ceil2 = double1.roundCeil(2);

    expect(ceil2.numbers).toEqual([2, 5510, 55546, 76000]);
    expect(ceil2.base).toBe(2);
    expect(ceil2.signed).toBe(1);
  });
});
