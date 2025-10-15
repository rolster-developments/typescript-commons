import { double } from './double';

describe('Double Class - Aritmethic Operations', () => {
  test('should resolve operation plus successful', () => {
    expect(double(0).plus(double(0)).data).toBe(0);
    expect(double(0).plus(double(34.8)).data).toBe(34.8);
    expect(double(20).plus(double(0)).data).toBe(20);

    expect(double(10).plus(double(20)).data).toBe(30);
    expect(double(4).plus(double(8)).data).toBe(12);
    expect(double(1040234).plus(double(2048)).data).toBe(1042282);
    expect(double(5490).plus(double(7135)).data).toBe(12625);
    expect(double(135945).plus(double(280523)).data).toBe(416468);

    expect(double(1.5).plus(double(3.25)).data).toBe(4.75);
    expect(double(4.0028).plus(double(10.132)).data).toBe(14.1348);
    expect(double(0.01).plus(double(0.02)).data).toBe(0.03);
    expect(double(0.00031).plus(double(23.76)).data).toBe(23.76031);

    expect(double(-10).plus(double(-20)).data).toBe(-30);
    expect(double(-1040234).plus(double(-2048)).data).toBe(-1042282);
    expect(double(-135945).plus(double(-280523)).data).toBe(-416468);
    expect(double(-4.0028).plus(double(-10.132)).data).toBe(-14.1348);
    expect(double(-0.00031).plus(double(-23.76)).data).toBe(-23.76031);
  });
});
