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

  it('should operation minus successful', () => {
    const number1 = Double.create(10);
    const number2 = Double.create(500);
    const zero = Double.create(0);

    expect(zero.fixed).toBe(0);
    expect(zero.minus(1000).fixed).toBe(-1000);
    expect(number1.minus(1000).fixed).toBe(-990);
    expect(number2.minus(175).fixed).toBe(325);
  });

  it('should operation divide successful', () => {
    const number1 = Double.create(12.5);
    const number2 = Double.create(100);
    const zero = Double.create(0);

    expect(zero.divide(1000).fixed).toBe(0);
    expect(number2.divide(3).fixed).toBe(33.33);
    expect(number2.divide(4).fixed).toBe(25);
    expect(number2.divide(8).fixed).toBe(12.5);
    expect(number1.divide(10).fixed).toBe(1.25);
    expect(number2.divide(2.5).fixed).toBe(40);
    expect(number2.divide(8.25).fixed).toBe(12.12);
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
